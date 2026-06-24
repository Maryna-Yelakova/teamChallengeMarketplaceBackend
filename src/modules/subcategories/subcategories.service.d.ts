import { Repository } from "typeorm";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { Subcategory } from "../../entities/subcategory.entity";
import { CategoriesService } from "../categories/categories.service";
export declare class SubcategoriesService {
    private readonly subcategoryRepo;
    private readonly categoriesService;
    constructor(subcategoryRepo: Repository<Subcategory>, categoriesService: CategoriesService);
    create(dto: CreateSubcategoryDto): Promise<Subcategory>;
    findAll(): Promise<Subcategory[]>;
    findOne(id: string): Promise<Subcategory>;
    update(id: string, dto: UpdateSubcategoryDto): Promise<Subcategory>;
    remove(id: string): Promise<void>;
}
