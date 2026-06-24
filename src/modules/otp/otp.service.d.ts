import { SmsProvider } from "../sms/sms.provider";
import { EmailProvider } from "../email/email.provider";
import { OtpStore } from "./otp.store";
import { UsersService } from "../users/users.service";
import { UpdateUsersDto } from "../users/dtos/update-user.dto";
export interface UpdatePhoneEmailDto extends UpdateUsersDto {
    isPhoneValidated?: boolean;
    isEmailValidated?: boolean;
}
export declare class OtpService {
    private sms;
    private email;
    private store;
    private usersService;
    constructor(sms: SmsProvider, email: EmailProvider, store: OtpStore, usersService: UsersService);
    private genCode;
    send(phone: string): Promise<{
        ok: boolean;
        devHint: string | undefined;
    }>;
    verify(phone: string, code: string): Promise<{
        ok: boolean;
        reason: string | undefined;
    }>;
    markPhoneAsValidated(phone: string): Promise<void>;
    sendEmail(email: string): Promise<{
        ok: boolean;
        devHint: string | undefined;
    }>;
    verifyEmail(email: string, code: string): Promise<{
        ok: boolean;
        reason: string | undefined;
    }>;
    markEmailAsValidated(email: string): Promise<void>;
}
