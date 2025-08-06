import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column()
  orderId: string;

  @Column()
  paymentMethod: "card" | "paypal" | "bank_transfer";

  @Column("decimal")
  amount: number;

  @Column()
  status: "pending" | "successful" | "failed";

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  transactionId?: string;
}
