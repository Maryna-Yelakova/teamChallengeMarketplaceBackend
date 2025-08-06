import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  productId: string;

  @Column("int")
  quantity: number;
}
