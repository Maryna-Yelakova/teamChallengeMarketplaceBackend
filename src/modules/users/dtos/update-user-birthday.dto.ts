import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateUserBirthdayDto {
  @ApiPropertyOptional({ description: "Date of birth", example: "1990-01-01" })
  @IsOptional()
  @IsDateString()
  birthDay?: string;
}
