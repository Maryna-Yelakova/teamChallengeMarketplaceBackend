import { SmsProvider } from "./sms.provider";
export declare class MockSmsProvider implements SmsProvider {
    sendOtp(phone: string, code: string): Promise<void>;
}
