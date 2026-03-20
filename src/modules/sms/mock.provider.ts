import { SmsProvider } from "./sms.provider";
export class MockSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async delay
    console.log(`[MOCK SMS] to ${phone}: code=${code}`);
  }
}
