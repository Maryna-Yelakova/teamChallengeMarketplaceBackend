import { Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+380501234500',
    description: 'Телефон у міжнародному форматі (E.164)',
  })
  @Matches(/^\+\d{10,15}$/, { message: "Phone must be in international format" })
  phone!: string;
  @ApiProperty({
    example: '000000',
    description: '6-значний OTP код з SMS',
    minLength: 6,
    maxLength: 6,
  })
  @Length(6, 6) code!: string;
}