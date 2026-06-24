import { SmsProvider } from "./sms.provider";
export declare class TwilioSmsProvider implements SmsProvider {
    private client;
    private from;
    sendOtp(phone: string, code: string): Promise<void>;
}
