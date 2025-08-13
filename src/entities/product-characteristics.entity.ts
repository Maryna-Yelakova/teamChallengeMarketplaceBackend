import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("product_characteristics")
export class ProductCharacteristic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Product, product => product.characteristics)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  value: string;
}
