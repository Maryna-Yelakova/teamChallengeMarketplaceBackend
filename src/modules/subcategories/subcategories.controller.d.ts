import { SubcategoriesService } from "./subcategories.service";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { Subcategory } from "../../entities/subcategory.entity";
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    constructor(subcategoriesService: SubcategoriesService);
    create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory>;
    findAll(): Promise<Subcategory[]>;
    findOne(id: string): Promise<Subcategory>;
    update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory>;
    remove(id: string): Promise<void>;
}
