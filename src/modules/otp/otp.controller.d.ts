import { SendOtpDto } from "./dtos/send-otp.dto";
import { VerifyOtpDto } from "./dtos/verify-otp.dto";
import { SendEmailOtpDto } from "./dtos/send-email-otp.dto";
import { VerifyEmailOtpDto } from "./dtos/verify-email-otp.dto";
import { OtpService } from "./otp.service";
export declare class OtpController {
    private otp;
    constructor(otp: OtpService);
    send(dto: SendOtpDto): Promise<{
        ok: boolean;
        devHint: string | undefined;
    }>;
    verify(dto: VerifyOtpDto): Promise<{
        ok: boolean;
        reason: string | undefined;
    } | {
        ok: boolean;
        reason?: undefined;
    }>;
    sendEmail(dto: SendEmailOtpDto): Promise<{
        ok: boolean;
        devHint: string | undefined;
    }>;
    verifyEmail(dto: VerifyEmailOtpDto): Promise<{
        ok: boolean;
        reason: string | undefined;
    }>;
}
