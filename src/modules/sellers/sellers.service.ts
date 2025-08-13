import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seller } from "../../entities/seller.entity";
import { Repository } from "typeorm";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepo: Repository<Seller>
  ) {}

  async create(createSellerDto: CreateSellerDto) {
    const existingSeller = await this.sellersRepo.findOne({
      where: { shopName: createSellerDto.shopName, userId: createSellerDto.userId }
    });
    if (existingSeller) {
      throw new BadRequestException("Seller with this shop name already exists for the user");
    }
    const seller = this.sellersRepo.create(createSellerDto);
    return await this.sellersRepo.save(seller);
  }

  findOne(id: string) {
    return this.sellersRepo.findOne({ where: { id }, relations: ["user", "products", "reviews"] });
  }

  update(id: string, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller with data: ${JSON.stringify(updateSellerDto)}`;
  }

  remove(id: string) {
    return `This action removes a #${id} seller`;
  }
}
