import { Order } from "./order.entity";
export declare class Payment {
    id: string;
    order: Order;
    orderId: string;
    paymentMethod: "card" | "paypal" | "bank_transfer";
    amount: number;
    status: "pending" | "successful" | "failed";
    paidAt?: Date;
    transactionId?: string;
}
