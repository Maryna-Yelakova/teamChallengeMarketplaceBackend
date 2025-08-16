import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seller } from "./seller.entity";
import { Subcategory } from "./subcategory.entity";
import { ApiProperty } from "@nestjs/swagger";
// import { ProductCharacteristic } from "./product-characteristics.entity";
import { Review } from "./review.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @ApiProperty({ description: "Seller of the product" })
  @ManyToOne(() => Seller, seller => seller.products)
  @JoinColumn({ name: "sellerId" })
  seller: Seller;

  @ApiProperty({ description: "Unique identifier", format: "uuid" })
  @Column()
  sellerId: string;

  @ApiProperty({ description: "Subcategory of the product" })
  @ManyToOne(() => Subcategory, subcategory => subcategory.products, { onDelete: "SET NULL" })
  @JoinColumn({ name: "subcategoryId" })
  subcategory: Subcategory;

  @ApiProperty({ description: "Subcategory ID", format: "uuid" })
  @Column()
  subcategoryId: string;

  @ApiProperty({ description: "Product title" })
  @Column()
  name: string;

  @ApiProperty({ description: "Product description" })
  @Column("text")
  description: string;

  @ApiProperty({ description: "Product price", type: "number" })
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: "Product stock quantity", type: "number" })
  @Column("int")
  stock: number;

  @ApiProperty({ description: "Product image URL", required: false })
  @Column("varchar", { nullable: true })
  imageUrl?: string;

  // @OneToMany(() => ProductCharacteristic, characteristics => characteristics.product)
  // characteristics: ProductCharacteristic[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}
