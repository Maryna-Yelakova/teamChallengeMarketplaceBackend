import { Category } from "./category.entity";
import { Product } from "./product.entity";
export declare class Subcategory {
    id: string;
    name: string;
    category: Category;
    categoryId: string;
    parentSubcategory?: Subcategory;
    parentSubcategoryId?: string;
    children: Subcategory[];
    products: Product[];
}
