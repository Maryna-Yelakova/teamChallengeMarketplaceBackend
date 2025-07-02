import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString({})
  firstName?: string;

  @IsString()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
