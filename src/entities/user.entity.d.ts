import { Seller } from "./seller.entity";
import { Address } from "./address.entity";
import { Cart } from "./cart.entity";
import { Wishlist } from "./wishlist.entity";
export declare class User {
    id: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    birthDay?: Date;
    phone: string;
    isPhoneValidated: boolean;
    email: string;
    isEmailValidated: boolean;
    password: string;
    isSeller: boolean;
    sellers: Seller[];
    addresses: Address[];
    carts: Cart[];
    wishlists: Wishlist[];
    createdAt: Date;
    updatedAt: Date;
}
