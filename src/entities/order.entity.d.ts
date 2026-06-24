import { User } from "./user.entity";
import { Coupon } from "./cupon.entity";
import { Payment } from "./payment.entity";
export declare class Order {
    id: string;
    user: User;
    userId: string;
    coupon?: Coupon;
    couponId?: string;
    totalPrice: number;
    discountAmount?: number;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
    payment: Payment;
}
