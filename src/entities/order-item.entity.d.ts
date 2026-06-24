import { Product } from "./product.entity";
import { Order } from "./order.entity";
export declare class OrderItem {
    id: string;
    order: Order;
    orderId: string;
    product: Product;
    productId: string;
    quantity: number;
    unitPrice: number;
}
