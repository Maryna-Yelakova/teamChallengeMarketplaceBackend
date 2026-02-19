import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ description: "User's email or phone number", example: "myemail@mail.com" })
  @IsString()
  identifier: string;

  @ApiProperty({ description: "User's password", example: "mysecretword" })
  @IsString()
  password: string;
}
