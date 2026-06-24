import { Repository } from "typeorm";
import { Product } from "../../entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { SellersService } from "../sellers/sellers.service";
import { SubcategoriesService } from "../subcategories/subcategories.service";
import { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsService {
    private readonly productsRepo;
    private readonly sellersService;
    private readonly subcategoriesService;
    constructor(productsRepo: Repository<Product>, sellersService: SellersService, subcategoriesService: SubcategoriesService);
    create({ sellerId, subcategoryId, ...rest }: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
}
