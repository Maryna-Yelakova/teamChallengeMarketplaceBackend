import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsString, IsOptional } from "class-validator";

export class UpdateUsersDto {
  @ApiPropertyOptional({ description: "User's first name", example: "Василь" })
  @IsOptional()
  @IsString()
  firstName?: string;

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
}
