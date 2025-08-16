import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "Category name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Category description", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
