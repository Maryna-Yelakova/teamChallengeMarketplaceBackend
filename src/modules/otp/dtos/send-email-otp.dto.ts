import { IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/** Legacy optional input; the pending session determines the actual OTP destination. */
export class SendEmailOtpDto {
  @ApiProperty({
    required: false,
    example: "user@example.com",
    description: "Email address for verification"
  })
  @IsOptional()
  @IsEmail({}, { message: "Must be a valid email address" })
  email?: string;
}
