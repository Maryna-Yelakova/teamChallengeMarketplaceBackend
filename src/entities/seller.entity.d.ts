import { User } from "./user.entity";
import { Product } from "./product.entity";
import { Review } from "./review.entity";
export declare class Seller {
    id: string;
    user: User;
    userId: string;
    shopName: string;
    legalAddress?: string;
    taxId?: string;
    phone?: string;
    description?: string;
    createdAt: Date;
    products: Product[];
    reviews: Review[];
}
