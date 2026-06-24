import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";
export declare class Cart {
    id: string;
    user: User;
    userId: string;
    items: CartItem[];
}
