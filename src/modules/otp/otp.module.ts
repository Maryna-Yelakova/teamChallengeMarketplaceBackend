// src/modules/otp/otp.module.ts
import { Module } from '@nestjs/common';
import { SMS_PROVIDER } from '../sms/sms.provider';
import { TwilioSmsProvider } from '../sms/twilio.provider';
import { MockSmsProvider } from '../sms/mock.provider';
import { OtpService } from './otp.service';
import { OtpStore } from './otp.store';
import { OtpController } from './otp.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OtpController],
  providers: [
    OtpService,
    OtpStore,
    {
      provide: SMS_PROVIDER,
      useClass: process.env.NODE_ENV === 'development' ? MockSmsProvider : TwilioSmsProvider,
    },
  ],
  exports: [SMS_PROVIDER, OtpService],
})
export class OtpModule {}
