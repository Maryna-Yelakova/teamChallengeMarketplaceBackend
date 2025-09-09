import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: "Current password", example: "oldpassword" })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: "New password", example: "newpassword", minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}