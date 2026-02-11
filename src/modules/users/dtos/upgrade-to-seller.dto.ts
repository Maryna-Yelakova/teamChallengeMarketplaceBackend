import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpgradeToSellerDto {
  @ApiProperty({ description: "Shop name", example: "My Amazing Shop" })
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiPropertyOptional({ description: "Legal address", example: "123 Main St, Kiev, Ukraine" })
  @IsOptional()
  @IsString()
  legalAddress?: string;

  @ApiPropertyOptional({ description: "Tax identifier", example: "12345678901" })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ description: "Phone number", example: "+380991234567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "Description of seller profile", example: "We sell quality products" })
  @IsOptional()
  @IsString()
  description?: string;
}
