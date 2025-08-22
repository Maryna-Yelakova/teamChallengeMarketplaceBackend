import { SmsProvider } from './sms.provider';
export class MockSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string) {
    console.log(`[MOCK SMS] to ${phone}: code=${code}`);
  }
}