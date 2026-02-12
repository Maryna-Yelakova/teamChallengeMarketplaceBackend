Реалізація email верифікації завершена. Ось що було зроблено:

  Створені файли:

  1. src/modules/email/email.provider.ts - інтерфейс для email провайдера
  2. src/modules/email/mock.provider.ts - мок провайдер для відправки email (логує в консоль)
  3. src/modules/otp/dtos/send-email-otp.dto.ts - DTO для відправки коду на email
  4. src/modules/otp/dtos/verify-email-otp.dto.ts - DTO для перевірки коду з email

  Оновлені файли:

  1. src/modules/otp/otp.store.ts - тепер універсальний, працює з email та phone
  2. src/modules/otp/otp.service.ts - додані методи sendEmail(), verifyEmail(), markEmailAsValidated()
  3. src/modules/otp/otp.module.ts - додано EMAIL_PROVIDER
  4. src/modules/otp/otp.controller.ts - додані ендпоінти:
    - POST /auth/phone/email/send - відправка коду на email
    - POST /auth/phone/email/verify - перевірка коду з email
  5. src/modules/users/dtos/update-user.dto.ts - додано поле isEmailValideted

  Як це працює:

  - При відправці запиту на /auth/phone/email/send з email, система генерує 6-значний код
  - У dev режимі код завжди 000000 і виводиться в консоль
  - Код зберігається в пам'яті (OtpStore) на 5 хвилин
  - При перевірці /auth/phone/email/verify система перевіряє код і оновлює isEmailValideted: true в базі

  Проект успішно компілюється



  Оновлений повний процес реєстрації

  Крок 1: Реєстрація

  POST /auth/register
  {
    "firstName": "Іван",
    "email": "ivan@example.com",
    "phone": "+380991234567",
    "password": "mypassword123"
  }
  ✅ Користувач створений з:
  - isPhoneValidated: false
  - isEmailValideted: false

  ---
  Крок 2: Верифікація телефону (ОБОВ'ЯЗКОВО)

  2.1. Відправка коду

  POST /auth/phone/send → { "phone": "+380991234567" }

  ✅ SMS відправлено (dev: код 000000 в консолі)

  2.2. Підтвердження

  POST /auth/phone/verify → { "phone": "+380991234567", "code": "000000" }

  ✅ isPhoneValidated: true в БД

  ---
  Крок 3: Верифікація email (ОБОВ'ЯЗКОВО)

  3.1. Відправка коду

  POST /auth/phone/email/send → { "email": "ivan@example.com" }

  ✅ Email відправлено (dev: код 000000 в консолі)

  3.2. Підтвердження

  POST /auth/phone/email/verify → { "email": "ivan@example.com", "code": "000000" }

  ✅ isEmailValideted: true в БД

  ---
  Крок 4: Логін (можливий тільки після обох верифікацій)

  POST /auth/login
  {
    "email": "ivan@example.com",
    "password": "mypassword123"
  }

  Перевірки в коді (src/modules/auth/auth.service.ts:52-66):
  1. ✅ Email та пароль правильні?
  2. ✅ isPhoneValidated === true?
    - ❌ Якщо false → 401: "Please verify your phone number first"
  3. ✅ isEmailValideted === true?
    - ❌ Якщо false → 401: "Please verify your email first"
  4. ✅ Генерація JWT токенів

  Успішна відповідь:
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }

  ---
   Ключові зміни:

  1. Додана перевірка email в методі login() (рядок 61-63)
  2. Оновлена Swagger документація з трьома прикладами помилок:
    - Invalid credentials
    - Phone not verified
    - Email not verified
  3. Порядок перевірок при логіні:
  Пароль → Телефон → Email → JWT генерація

  Тепер користувач не зможе залогінитися доки не підтвердить і телефон, і email!