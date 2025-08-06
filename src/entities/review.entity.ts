import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Seller } from "./seller.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Product, product => product.reviews, { nullable: true })
  @JoinColumn({ name: "productId" })
  product?: Product;

  @Column({ nullable: true })
  productId?: string;

  @ManyToOne(() => Seller, seller => seller.reviews, { nullable: true })
  @JoinColumn({ name: "sellerId" })
  seller?: Seller;

  @Column({ nullable: true })
  sellerId?: string;

  @Column("int")
  rating: number;

  @Column("text")
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
