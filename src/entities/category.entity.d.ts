import { Subcategory } from "./subcategory.entity";
export declare class Category {
    id: string;
    name: string;
    description?: string;
    subcategories: Subcategory[];
}
