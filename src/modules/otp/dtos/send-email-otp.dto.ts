import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for verification',
  })
  @IsEmail({}, { message: "Must be a valid email address" })
  email!: string;
}
