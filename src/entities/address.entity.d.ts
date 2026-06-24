import { User } from "./user.entity";
export declare class Address {
    id: string;
    user: User;
    userId: string;
    title?: string;
    country: string;
    city: string;
    region?: string;
    street: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    isDefault: boolean;
    createdAt: Date;
}
