export interface SmsProvider {
    sendOtp(phone: string, code: string): Promise<void>;
}
export declare const SMS_PROVIDER: unique symbol;
