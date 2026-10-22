/** Placeholder written to logs instead of a sensitive value. */
const REDACTED = "[REDACTED]";

/** Field names to redact after punctuation and case are removed. */
const sensitiveKeys = new Set([
  "password",
  "currentpassword",
  "newpassword",
  "code",
  "otp",
  "otpcode",
  "verificationcode",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "cookie",
  "cookies",
  "bankaccount",
  "accountnumber",
  "iban",
  "bic",
  "swift",
  "routingnumber",
  "cardnumber",
  "cvv",
  "cvc",
  "document",
  "documents",
  "documentnumber",
  "passport",
  "passportnumber",
  "file",
  "files"
]);

/** Makes names such as access_token and accessToken comparable. */
function normalizeKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/** Copies nested request data, replacing values of sensitive fields. */
export function redactSensitiveData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      sensitiveKeys.has(normalizeKey(key)) ? REDACTED : redactSensitiveData(nestedValue)
    ])
  );
}
