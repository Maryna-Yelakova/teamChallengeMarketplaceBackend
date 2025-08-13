import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seller } from "./seller.entity";
import { Subcategory } from "./subcategory.entity";
import { ProductCharacteristic } from "./product-characteristics.entity";
import { Review } from "./review.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Seller, seller => seller.products)
  @JoinColumn({ name: "sellerId" })
  seller: Seller;

  @Column()
  sellerId: string;

  @ManyToOne(() => Subcategory, sub => sub.products)
  @JoinColumn({ name: "subcategoryId" })
  subcategory: Subcategory;

  @Column()
  subcategoryId: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("int")
  stock: number;

  @OneToMany(() => ProductCharacteristic, char => char.product)
  characteristics: ProductCharacteristic[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}
