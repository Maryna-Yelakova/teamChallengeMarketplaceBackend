import { SellersService } from "./sellers.service";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { Seller } from "../../entities/seller.entity";
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    create(createSellerDto: CreateSellerDto): Promise<Seller>;
    findOne(id: string): Promise<Seller | null>;
    update(id: string, updateSellerDto: UpdateSellerDto): string;
    remove(id: string): string;
}
