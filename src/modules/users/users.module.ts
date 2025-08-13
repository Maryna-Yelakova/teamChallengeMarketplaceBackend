import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Seller } from "src/entities/seller.entity";
import { Address } from "src/entities/address.entity";
import { Cart } from "src/entities/cart.entity";
import { Wishlist } from "src/entities/wishlist.entity";
import { Product } from "src/entities/product.entity";
import { Subcategory } from "src/entities/subcategory.entity";
import { Category } from "src/entities/category.entity";
import { ProductCharacteristic } from "src/entities/product-characteristics.entity";
import { Review } from "src/entities/review.entity";
import { CartItem } from "src/entities/cart-item.entity";
import { Order } from "src/entities/order.entity";
import { OrderItem } from "src/entities/order-item.entity";
import { Coupon } from "src/entities/cupon.entity";
import { Payment } from "src/entities/payment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Seller,
      Address,
      Cart,
      CartItem,
      Wishlist,
      Product,
      Wishlist,
      Seller,
      Address,
      Subcategory,
      Category,
      ProductCharacteristic,
      Review,
      Order,
      OrderItem,
      Coupon,
      Payment
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
