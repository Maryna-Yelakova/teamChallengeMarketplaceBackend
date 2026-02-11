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

    const existingSellerByUser = await this.sellersRepo.findOne({ where: { userId } });
    if (existingSellerByUser) {
      throw new BadRequestException("Seller profile already exists for this user");
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

  async update(id: string, userId: string, updateSellerDto: UpdateSellerDto) {
    const seller = await this.findOneOrThrow(id);

    if (seller.userId !== userId) {
      throw new ForbiddenException("You can update only your own seller profile");
    }

    if (updateSellerDto.shopName && updateSellerDto.shopName !== seller.shopName) {
      const duplicateShop = await this.sellersRepo.findOne({
        where: { userId, shopName: updateSellerDto.shopName }
      });
      if (duplicateShop && duplicateShop.id !== id) {
        throw new BadRequestException("Seller with this shop name already exists for the user");
      }
    }

    Object.assign(seller, updateSellerDto);
    return this.sellersRepo.save(seller);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.usersRepo.manager.transaction(async manager => {
      const sellersRepo = manager.getRepository(Seller);
      const usersRepo = manager.getRepository(User);

      const seller = await sellersRepo.findOne({ where: { id } });
      if (!seller) {
        throw new NotFoundException("Seller not found");
      }
      if (seller.userId !== userId) {
        throw new ForbiddenException("You can delete only your own seller profile");
      }

      await sellersRepo.delete(id);

      const hasSellerProfile = await sellersRepo.findOne({ where: { userId } });
      if (!hasSellerProfile) {
        await usersRepo.update({ id: userId }, { isSeller: false });
      }
    });
  }

  private async findOneOrThrow(id: string): Promise<Seller> {
    const seller = await this.findOne(id);
    if (!seller) {
      throw new NotFoundException("Seller not found");
    }
    return seller;
  }
}
