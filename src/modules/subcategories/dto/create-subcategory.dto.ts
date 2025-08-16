import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSubcategoryDto {
  @ApiProperty({ description: "Subcategory name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Parent category ID", format: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: "Optional parent subcategory ID for nesting",
    format: "uuid",
    required: false
  })
  @IsOptional()
  @IsUUID()
  parentSubcategoryId?: string;
}
