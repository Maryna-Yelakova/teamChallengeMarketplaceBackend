import { IsDate, IsEmail, IsString } from "class-validator";

export class UpdateUsersDto {
  @IsString()
  firstName: string;

  @IsString()
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsDate()
  birthDay: Date;
}
