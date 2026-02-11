import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seller } from "../../entities/seller.entity";
import { Repository } from "typeorm";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { User } from "src/entities/user.entity";

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepo: Repository<Seller>,
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async create(userId: string, createSellerDto: CreateSellerDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.isSeller) {
      throw new ForbiddenException("User does not have seller permissions");
    }

    const existingSeller = await this.sellersRepo.findOne({
      where: { shopName: createSellerDto.shopName, userId }
    });
    if (existingSeller) {
      throw new BadRequestException("Seller with this shop name already exists for the user");
    }
    const seller = this.sellersRepo.create({
      ...createSellerDto,
      userId
    });
    return await this.sellersRepo.save(seller);
  }

  findOne(id: string) {
    return this.sellersRepo.findOne({ where: { id }, relations: ["user", "products"] });
  }

  update(id: string, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller with data: ${JSON.stringify(updateSellerDto)}`;
  }

  remove(id: string) {
    return `This action removes a #${id} seller`;
  }
}
