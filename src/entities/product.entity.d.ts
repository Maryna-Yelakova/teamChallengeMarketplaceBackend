import { Seller } from "./seller.entity";
import { Subcategory } from "./subcategory.entity";
import { Review } from "./review.entity";
export declare class Product {
    id: string;
    seller: Seller;
    sellerId: string;
    subcategory: Subcategory;
    subcategoryId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    reviews: Review[];
}
