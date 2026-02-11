import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsString, IsOptional, IsBoolean } from "class-validator";

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

  @ApiPropertyOptional({ description: "User's birthday", example: "2020-07-04" })
  @IsOptional()
  @IsDateString()
  birthDay?: string;

  @ApiPropertyOptional({ description: "User's password", example: "mysecretword" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: "Whether user's phone is validated", example: false })
  @IsOptional()
  @IsBoolean()
  isPhoneValidated?: boolean;
}
