import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEmail, IsString } from "class-validator";

export class UpdateUsersDto {
  @ApiPropertyOptional({ description: "User's first name", example: "Василь" })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: "User's phone number", example: "+380991234567" })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: "User's email", example: "basilbasilyuk@mail.gov" })
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: "User's middle name", example: "Васильович" })
  @IsString()
  middleName: string;

  @ApiPropertyOptional({ description: "User's last name", example: "Василюк" })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: "User's birthday", example: "04.07.2020" })
  @IsDate()
  birthDay: Date;
}
