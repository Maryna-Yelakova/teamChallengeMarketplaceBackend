import { IsEmail, Length, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/** Validates the code; verification uses the contact bound to the pending session. */
export class VerifyEmailOtpDto {
  @ApiProperty({
    required: false,
    example: "user@example.com",
    description: "Email address to verify"
  })
  @IsOptional()
  @IsEmail({}, { message: "Must be a valid email address" })
  email?: string;

  @ApiProperty({
    example: "000000",
    description: "6-digit OTP code from email",
    minLength: 6,
    maxLength: 6
  })
  @Length(6, 6)
  code!: string;
}
