import { Product } from "./product.entity";
import { Seller } from "./seller.entity";
export declare class Review {
    id: string;
    userId: string;
    product?: Product;
    productId?: string;
    seller?: Seller;
    sellerId?: string;
    rating: number;
    comment: string;
    createdAt: Date;
}
