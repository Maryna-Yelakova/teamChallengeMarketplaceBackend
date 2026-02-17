import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { SmsProvider, SMS_PROVIDER } from "../sms/sms.provider";
import { EmailProvider, EMAIL_PROVIDER } from "../email/email.provider";
import { OtpStore } from "./otp.store";
import { UsersService } from "../users/users.service";

@Injectable()
export class OtpService {
  constructor(
    @Inject(SMS_PROVIDER) private sms: SmsProvider,
    @Inject(EMAIL_PROVIDER) private email: EmailProvider,
    private store: OtpStore,
    private usersService: UsersService
  ) {}

  private genCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async send(phone: string) {
    const ok = this.store.canSend(phone);
    if (!ok.ok) {
      // ⬇️ щоб не перетворюватися на 500 Internal Server Error
      throw new BadRequestException(ok.reason);
    }

    const code = process.env.NODE_ENV === "development" ? "000000" : this.genCode();

    this.store.set(phone, code);
    await this.sms.sendOtp(phone, code);

    return {
      ok: true,
      devHint: process.env.NODE_ENV === "development" ? code : undefined
    };
  }

  async verify(phone: string, code: string) {
    // ⬇️ 1) якщо телефон уже підтверджений — повертаємо коректну reason
    const user = await this.usersService.findByPhone(phone);
    if (user?.isPhoneValidated) {
      return { ok: false, reason: "Phone already verified" };
    }

    // ⬇️ 2) стандартна перевірка з тимчасового сховища
    const res = this.store.verify(phone, code);

    // ⬇️ 3) (опційно) робимо reason більш зрозумілою, ніж "No code"
    if (!res.ok && res.reason === "No code") {
      return { ok: false, reason: "Code not found (expired or not requested)" };
    }

    return res;
  }

  async markPhoneAsValidated(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (user && !user.isPhoneValidated) {
      await this.usersService.update(user.id, { isPhoneValidated: true });
    }
  }

  async sendEmail(email: string) {
    const ok = this.store.canSend(email);
    if (!ok.ok) {
      throw new BadRequestException(ok.reason);
    }

    const code = process.env.NODE_ENV === "development" ? "000000" : this.genCode();

    this.store.set(email, code);
    await this.email.sendOtp(email, code);

    return {
      ok: true,
      devHint: process.env.NODE_ENV === "development" ? code : undefined
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (user?.isEmailValidated) {
      return { ok: false, reason: "Email already verified" };
    }

    const res = this.store.verify(email, code);

    if (!res.ok && res.reason === "No code") {
      return { ok: false, reason: "Code not found (expired or not requested)" };
    }

    return res;
  }

  async markEmailAsValidated(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && !user.isEmailValidated) {
      await this.usersService.update(user.id, { isEmailValideted: true });
    }
  }
}

// import { Injectable, Inject } from '@nestjs/common';
// import { SmsProvider, SMS_PROVIDER } from '../sms/sms.provider';
// import { OtpStore } from './otp.store';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class OtpService {
//   constructor(
//     @Inject(SMS_PROVIDER) private sms: SmsProvider,
//     private store: OtpStore,
//     private usersService: UsersService
//   ) {}

//   private genCode() { return Math.floor(100000 + Math.random()*900000).toString(); }

//   async send(phone: string) {
//     const ok = this.store.canSend(phone);
//     if (!ok.ok) throw new Error(ok.reason);
//     const code = process.env.NODE_ENV === 'development' ? '000000' : this.genCode();
//     this.store.set(phone, code);
//     await this.sms.sendOtp(phone, code);
//     return {
//       ok: true,
//       devHint: process.env.NODE_ENV === 'development' ? code : undefined
//     };
//   }

//   async verify(phone: string, code: string) {
//     const res = this.store.verify(phone, code);
//     return res;
//   }

//   async markPhoneAsValidated(phone: string) {
//     const user = await this.usersService.findByPhone(phone);
//     if (user) {
//       await this.usersService.update(user.id, { isPhoneValidated: true });
//     }
//   }
// }
