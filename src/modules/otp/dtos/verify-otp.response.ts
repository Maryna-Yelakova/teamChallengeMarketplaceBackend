import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({
    example: 'Phone already verified',
    required: false,
    description: 'Причина, якщо ok=false',
  })
  reason?: string;
}
