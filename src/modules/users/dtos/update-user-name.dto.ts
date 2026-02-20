import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserNameDto {
  @ApiPropertyOptional({ description: "First name", example: "Василь" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "Middle name", example: "Іванович" })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: "Last name", example: "Петренко" })
  @IsOptional()
  @IsString()
  lastName?: string;
}
