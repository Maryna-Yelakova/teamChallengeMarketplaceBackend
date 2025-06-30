import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  id?: number;

  @IsString()
  firstName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
