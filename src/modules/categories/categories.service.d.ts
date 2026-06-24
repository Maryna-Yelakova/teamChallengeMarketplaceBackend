import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "../../entities/category.entity";
import { Repository } from "typeorm";
export declare class CategoriesService {
    private readonly categoriesRepo;
    constructor(categoriesRepo: Repository<Category>);
    create(dto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
