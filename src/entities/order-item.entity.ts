import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  productId: string;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  unitPrice: number;
}
