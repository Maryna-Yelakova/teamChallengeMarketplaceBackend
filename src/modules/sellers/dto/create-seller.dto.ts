import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSellerDto {
  @ApiProperty({ description: "User id (owner of the shop)", format: "uuid" })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: "Shop name" })
  @IsNotEmpty()
  @IsString()
  shopName: string;

  @ApiProperty({ description: "Legal address", required: false })
  @IsOptional()
  @IsString()
  legalAddress?: string;

  @ApiProperty({ description: "Tax identifier", required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ description: "Phone number", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "Description", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
