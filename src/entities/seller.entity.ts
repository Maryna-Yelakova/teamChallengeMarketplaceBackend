import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { Review } from "./review.entity";

@Entity("sellers")
export class Seller {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.sellers)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @Column()
  shopName: string;

  @Column({ nullable: true })
  legalAddress?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @OneToMany(() => Review, review => review.seller)
  reviews: Review[];
}
