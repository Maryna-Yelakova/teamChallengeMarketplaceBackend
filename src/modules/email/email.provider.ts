export interface EmailProvider {
  sendOtp(email: string, code: string): Promise<void>;
}

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');
