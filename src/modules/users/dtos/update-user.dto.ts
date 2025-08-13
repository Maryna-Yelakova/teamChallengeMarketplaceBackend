import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUsersDto {
  @ApiPropertyOptional({ description: "User's first name", example: "Василь" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "User's phone number", example: "+380991234567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "User's email", example: "basilbasilyuk@mail.gov" })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: "User's middle name", example: "Васильович" })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: "User's last name", example: "Василюк" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: "User's birthday", example: "04.07.2020" })
  @IsOptional()
  @IsDate()
  birthDay?: Date;

  @IsOptional()
  @IsString()
  password?: string;
}
