import { ApiProperty } from '@nestjs/swagger';

export class SendOtpResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({
    example: 'OTP sent to +380931234567',
    required: false,
  })
  message?: string;

  @ApiProperty({
    example: '000000',
    required: false,
    description: 'DEV-підказка (тільки у development)',
  })
  devHint?: string;
}
