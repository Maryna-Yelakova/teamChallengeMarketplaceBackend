import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ description: "User's email", example: "myemail@mail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", example: "mysecretword" })
  @IsString()
  password: string;
}
