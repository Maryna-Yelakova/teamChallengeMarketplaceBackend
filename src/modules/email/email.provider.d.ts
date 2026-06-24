export interface EmailProvider {
    sendOtp(email: string, code: string): Promise<void>;
}
export declare const EMAIL_PROVIDER: unique symbol;
