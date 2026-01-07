import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to verify',
  })
  @IsEmail({}, { message: "Must be a valid email address" })
  email!: string;

  @ApiProperty({
    example: '000000',
    description: '6-digit OTP code from email',
    minLength: 6,
    maxLength: 6,
  })
  @Length(6, 6)
  code!: string;
}
