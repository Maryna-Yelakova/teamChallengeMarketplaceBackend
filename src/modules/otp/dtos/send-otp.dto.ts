import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SendOtpDto { 
  @ApiProperty({
    example: '+380931234567',
    description: 'Phone number у міжнародному форматі (E.164)',
  })
  @Matches(/^\+\d{10,15}$/, { message: "Phone must be in international format" })
  phone!: string; 
}

