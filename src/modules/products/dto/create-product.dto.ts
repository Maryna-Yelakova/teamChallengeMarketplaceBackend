import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsPositive } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ description: "Product name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Product description", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Price", example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: "Product quantity", required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: "Seller ID", format: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  sellerId: string;

  @ApiProperty({ description: "Subcategory ID", format: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  subcategoryId: string;
}
