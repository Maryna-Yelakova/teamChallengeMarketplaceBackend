import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
export declare class CartItem {
    id: string;
    cart: Cart;
    cartId: string;
    product: Product;
    productId: string;
    quantity: number;
}
