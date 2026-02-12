import { EmailProvider } from './email.provider';

export class MockEmailProvider implements EmailProvider {
  async sendOtp(email: string, code: string) {
    console.log(`[MOCK EMAIL] to ${email}: code=${code}`);
  }
}
