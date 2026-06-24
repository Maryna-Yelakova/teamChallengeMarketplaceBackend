import { Seller } from "../../entities/seller.entity";
import { Repository } from "typeorm";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
export declare class SellersService {
    private sellersRepo;
    constructor(sellersRepo: Repository<Seller>);
    create(createSellerDto: CreateSellerDto): Promise<Seller>;
    findOne(id: string): Promise<Seller | null>;
    update(id: string, updateSellerDto: UpdateSellerDto): string;
    remove(id: string): string;
}
