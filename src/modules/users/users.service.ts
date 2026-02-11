import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Seller } from "../../entities/seller.entity";
import { Repository } from "typeorm";
import { UpdateUsersDto } from "./dtos/update-user.dto";
import { UpgradeToSellerDto } from "./dtos/upgrade-to-seller.dto";

type CreateUserData = Pick<User, "firstName" | "phone" | "email" | "password"> &
  Partial<
    Pick<User, "middleName" | "lastName" | "birthDay" | "isPhoneValidated" | "isEmailValideted" | "isSeller">
  >;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Seller)
    private sellersRepo: Repository<Seller>
  ) {}

  async create(createUserData: CreateUserData) {
    const existingUser = await this.usersRepo.findOne({ where: { email: createUserData.email } });
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const user = this.usersRepo.create(createUserData);
    return await this.usersRepo.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findByPhone(phone: string) {
    return this.usersRepo.findOne({ where: { phone } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: Partial<UpdateUsersDto>): Promise<User | undefined> {
    const user = await this.findById(id);
    if (!user) return undefined;
    Object.assign(user, updateUserDto);
    return await this.usersRepo.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepo.delete({ id });
  }

  async changePhone(id: string, newPhone: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const existingUser = await this.usersRepo.findOne({ where: { phone: newPhone } });
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException("Phone number is already in use");
    }

    user.phone = newPhone;
    user.isPhoneValidated = false;
    
    return await this.usersRepo.save(user);
  }

  async upgradeToSeller(userId: string, dto: UpgradeToSellerDto) {
    return this.usersRepo.manager.transaction(async manager => {
      const usersRepo = manager.getRepository(User);
      const sellersRepo = manager.getRepository(Seller);

      const user = await usersRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const existingSeller = await sellersRepo.findOne({ where: { userId } });
      if (user.isSeller || existingSeller) {
        throw new BadRequestException("User is already a seller");
      }

      const seller = sellersRepo.create({
        userId,
        shopName: dto.shopName,
        legalAddress: dto.legalAddress,
        taxId: dto.taxId,
        phone: dto.phone,
        description: dto.description
      });
      const savedSeller = await sellersRepo.save(seller);

      user.isSeller = true;
      const updatedUser = await usersRepo.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = updatedUser;

      return {
        message: "Account upgraded to seller",
        user: safeUser,
        seller: savedSeller
      };
    });
  }
}
