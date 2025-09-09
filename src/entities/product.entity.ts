import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seller } from "./seller.entity";
import { Subcategory } from "./subcategory.entity";
import { ApiProperty } from "@nestjs/swagger";
// import { ProductCharacteristic } from "./product-characteristics.entity";
import { Review } from "./review.entity";

@Entity("products")
export class Product {
  @ApiProperty({ description: "Unique identifier", format: "uuid" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Seller, seller => seller.products)
  @JoinColumn({ name: "sellerId" })
  seller: Seller;

  @ApiProperty({ description: "Seller ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" })
  @Column()
  sellerId: string;

  @ManyToOne(() => Subcategory, subcategory => subcategory.products, { onDelete: "SET NULL" })
  @JoinColumn({ name: "subcategoryId" })
  subcategory: Subcategory;

  @ApiProperty({ description: "Subcategory ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" })
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
