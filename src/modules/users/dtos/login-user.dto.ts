import { IsEmail, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ description: "User's email", example: "myemail@mail.com" })
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Email must contain only Latin characters"
  })
  email: string;

  @ApiProperty({ description: "User's password", example: "mysecretword" })
  @IsString()
  password: string;
}
