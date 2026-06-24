import { User } from "./user.entity";
import { Product } from "./product.entity";
export declare class Wishlist {
    id: string;
    user: User;
    userId: string;
    product: Product;
    productId: string;
}
