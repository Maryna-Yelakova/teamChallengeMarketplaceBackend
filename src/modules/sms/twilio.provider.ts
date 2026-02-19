// src/modules/sms/twilio.provider.ts
import { Twilio } from "twilio";
import { SmsProvider } from "./sms.provider";

export class TwilioSmsProvider implements SmsProvider {
  private client = new Twilio("" + process.env.TWILIO_SID, "" + process.env.TWILIO_TOKEN);
  private from = process.env.TWILIO_FROM;

  async sendOtp(phone: string, code: string): Promise<void> {
    await this.client.messages.create({
      from: this.from,
      to: phone,
      body: `Your verification code: ${code}`
    });
  }
}
