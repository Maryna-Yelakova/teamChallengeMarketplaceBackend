import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { SmsProvider, SMS_PROVIDER } from "../sms/sms.provider";
import { EmailProvider, EMAIL_PROVIDER } from "../email/email.provider";
import { OtpStore } from "./otp.store";
import { RegistrationService } from "../registration/registration.service";
import { RegistrationContactChannel } from "../../entities/registration-contact.entity";

/** Binds each challenge to one registration, contact, and channel before granting ownership. */
@Injectable()
export class OtpService {
  constructor(
    @Inject(SMS_PROVIDER) private readonly sms: SmsProvider,
    @Inject(EMAIL_PROVIDER) private readonly email: EmailProvider,
    private readonly store: OtpStore,
    private readonly registrations: RegistrationService
  ) {}

  async send(userId: string, channel: RegistrationContactChannel) {
    const { contact } = await this.registrations.sendChallenge(userId, channel);
    const key = this.key(userId, channel, contact.normalizedValue);
    const limit = this.store.canSend(key);
    if (!limit.ok) throw new BadRequestException("Unable to send verification code at this time");
    const code = process.env.NODE_ENV === "development" ? "000000" : this.genCode();
    this.store.set(key, code);
    if (channel === "phone") await this.sms.sendOtp(contact.value, code);
    else await this.email.sendOtp(contact.value, code);
    return { ok: true, devHint: process.env.NODE_ENV === "development" ? code : undefined };
  }

  async verify(userId: string, channel: RegistrationContactChannel, code: string) {
    const { contact } = await this.registrations.sendChallenge(userId, channel);
    const key = this.key(userId, channel, contact.normalizedValue);
    const result = this.store.verify(key, code);
    if (!result.ok) return { ok: false, message: "Unable to verify code. Check it and try again." };
    const session = await this.registrations.verify(userId, channel);
    return { ok: true, ...session };
  }

  private genCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /** Different registrations or replacement contacts cannot reuse each other's code. */
  private key(userId: string, channel: RegistrationContactChannel, normalizedValue: string) {
    return `${userId}:${channel}:${normalizedValue}`;
  }
}
