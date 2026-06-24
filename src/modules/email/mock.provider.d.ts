import { EmailProvider } from './email.provider';
export declare class MockEmailProvider implements EmailProvider {
    sendOtp(email: string, code: string): Promise<void>;
}
