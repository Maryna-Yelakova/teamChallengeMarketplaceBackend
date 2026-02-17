import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Seller } from "./seller.entity";
import { Address } from "./address.entity";
import { Cart } from "./cart.entity";
import { Wishlist } from "./wishlist.entity";
// import { Review } from "./review.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  birthDay?: Date;

  @Column()
  phone: string;

  @Column({ default: false })
  isPhoneValidated: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailValidated: boolean;

  @Column()
  password: string;

  @Column({ default: false })
  isSeller: boolean;

  @OneToMany(() => Seller, seller => seller.user)
  sellers: Seller[];

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => Cart, cart => cart.user)
  carts: Cart[];

  @OneToMany(() => Wishlist, wishlist => wishlist.user)
  wishlists: Wishlist[];

  // @OneToMany(() => Review, review => review.user)
  // reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
