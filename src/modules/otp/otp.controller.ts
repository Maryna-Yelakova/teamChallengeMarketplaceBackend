import { Body, Controller, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { JwtRegistrationGuard } from "../registration/registration.guard";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "./dtos/verify-otp.dto";
import { VerifyEmailOtpDto } from "./dtos/verify-email-otp.dto";

/** Resolves the registration from its scoped token rather than a client-supplied user ID. */
@ApiTags("Otp")
@ApiBearerAuth("JWT-auth")
@Controller("otp")
@Public()
@UseGuards(JwtRegistrationGuard)
export class OtpController {
  constructor(private readonly otp: OtpService) {}

  @Post("phone/send")
  send(@Req() request: Request & { user: { userId: string } }) {
    return this.otp.send(request.user.userId, "phone");
  }

  @Post("phone/verify")
  @HttpCode(200)
  verify(@Req() request: Request & { user: { userId: string } }, @Body() dto: VerifyOtpDto) {
    return this.otp.verify(request.user.userId, "phone", dto.code);
  }

  @Post("email/send")
  sendEmail(@Req() request: Request & { user: { userId: string } }) {
    return this.otp.send(request.user.userId, "email");
  }

  @Post("email/verify")
  @HttpCode(200)
  verifyEmail(
    @Req() request: Request & { user: { userId: string } },
    @Body() dto: VerifyEmailOtpDto
  ) {
    return this.otp.verify(request.user.userId, "email", dto.code);
  }
}
