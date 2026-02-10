import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUsersDto } from "./dtos/update-user.dto";

import { BadRequestException } from "@nestjs/common";

type CreateUserData = Pick<User, "firstName" | "phone" | "email" | "password"> &
  Partial<
    Pick<User, "middleName" | "lastName" | "birthDay" | "isPhoneValidated" | "isEmailValideted" | "isSeller">
  >;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
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
}
