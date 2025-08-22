
import { Injectable, Inject } from '@nestjs/common';
import { SmsProvider, SMS_PROVIDER } from '../sms/sms.provider';
import { OtpStore } from './otp.store';
import { UsersService } from '../users/users.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject(SMS_PROVIDER) private sms: SmsProvider, 
    private store: OtpStore,
    private usersService: UsersService
  ) {}

  private genCode() { return Math.floor(100000 + Math.random()*900000).toString(); }

  async send(phone: string) {
    const ok = this.store.canSend(phone);
    if (!ok.ok) throw new Error(ok.reason);
    const code = process.env.NODE_ENV === 'development' ? '000000' : this.genCode();
    this.store.set(phone, code);
    await this.sms.sendOtp(phone, code);
    return { 
      ok: true,
      devHint: process.env.NODE_ENV === 'development' ? code : undefined 
    };
  }

  async verify(phone: string, code: string) {
    const res = this.store.verify(phone, code);
    return res;
  }

  async markPhoneAsValidated(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (user) {
      await this.usersService.update(user.id, { isPhoneValidated: true });
    }
  }
}
