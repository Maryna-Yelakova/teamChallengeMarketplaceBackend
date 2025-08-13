import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CartItem, item => item.cart)
  items: CartItem[];
}
