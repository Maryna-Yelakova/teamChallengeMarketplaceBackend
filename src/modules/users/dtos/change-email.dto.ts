import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ChangeEmailDto {
  @ApiProperty({ description: "New email address", example: "new@example.com" })
  @IsEmail()
  newEmail: string;
}
