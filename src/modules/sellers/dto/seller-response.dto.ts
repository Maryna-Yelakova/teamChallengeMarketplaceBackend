import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { Seller } from "../../../entities/seller.entity";

/** Public shop fields; owner, tax, and legal details are not serialized. */
export class SellerResponseDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  userId: string;

  @ApiProperty()
  shopName: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date;
}

/** Never spread the Seller entity: its user relation may contain a password. */
export function toSellerResponse(seller: Seller): SellerResponseDto {
  return {
    id: seller.id,
    userId: seller.userId,
    shopName: seller.shopName,
    phone: seller.phone,
    description: seller.description,
    createdAt: seller.createdAt
  };
}
