import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { User } from "./user.entity";
import { Coupon } from "./cupon.entity";
import { Payment } from "./payment.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Coupon, { nullable: true })
  @JoinColumn({ name: "couponId" })
  coupon?: Coupon;

  @Column({ nullable: true })
  couponId?: string;

  @Column("decimal")
  totalPrice: number;

  @Column({ nullable: true })
  discountAmount?: number;

  @Column()
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Payment, payment => payment.order)
  payment: Payment;
}
