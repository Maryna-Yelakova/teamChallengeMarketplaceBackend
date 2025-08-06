import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity("wishlists")
export class Wishlist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.wishlists)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  productId: string;
}
