// otp/otp.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
// import { SendOtpDto } from './dto/send-otp.dto';
import { SendOtpDto } from '../users/dtos/send-otp.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpDto } from '../users/dtos/verify-otp.dto';
import { OtpService } from './otp.service';

@Controller('auth/phone')
export class OtpController {
  constructor(private otp: OtpService) {}

  @Post('send')
  send(@Body() dto: SendOtpDto) {
    return this.otp.send(dto.phone); // у dev поверне { devHint: '000000' }
  }

  @Post('verify')
  async verify(@Body() dto: VerifyOtpDto) {
    const res = await this.otp.verify(dto.phone, dto.code);
    if (!res.ok) return { ok:false, reason:res.reason };
    
    await this.otp.markPhoneAsValidated(dto.phone);
    return { ok:true };
  }
}
