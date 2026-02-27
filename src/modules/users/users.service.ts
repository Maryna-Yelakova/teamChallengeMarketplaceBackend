import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { LessThan, Repository } from "typeorm";
import { UpdateUsersDto } from "./dtos/update-user.dto";

import { BadRequestException } from "@nestjs/common";

import { CreateUserDto } from "./dtos/create-user.dto";
import { Request } from "express";

import { Action, AppAbility } from "src/casl/casl-ability.types";
import { ForbiddenError } from "@casl/ability";
import { ChangePasswordDto } from "../auth/dtos/change-password.dto";
import * as bcrypt from "bcrypt";
// import { Action } from "src/casl/casl-ability.types";
// import { ForbiddenError } from "@casl/ability";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepo.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const user = this.usersRepo.create(createUserDto);
    return await this.usersRepo.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findByPhone(phone: string) {
    return this.usersRepo.findOne({ where: { phone } });
  }

  async findById(id: string, ability: AppAbility) {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    ForbiddenError.from(ability).throwUnlessCan(Action.Read, user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUsersDto>,
    ability: AppAbility
  ): Promise<User | undefined> {
    const user = await this.findById(id, ability);

    Object.assign(user, updateUserDto);
    return await this.usersRepo.save(user);
  }

  async delete(id: string, ability: AppAbility): Promise<void> {
    const user = await this.findById(id, ability);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.usersRepo.delete({ id });
  }

  async changePhone(id: string, newPhone: string, ability: AppAbility) {
    const user = await this.findById(id, ability);

    const existingUser = await this.usersRepo.findOne({ where: { phone: newPhone } });
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException("Phone number is already in use");
    }

    user.phone = newPhone;
    user.isPhoneValidated = false;

    return await this.usersRepo.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto, ability: AppAbility) {
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException("New password must be different from current password");
    }

    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    ForbiddenError.from(ability).throwUnlessCan(Action.Update, user);

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);

    await this.usersRepo.save(user);

    return { message: "Password changed successfully" };
  }

  async deleteUnverifiedUsers() {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await this.usersRepo.delete({
      createdAt: LessThan(twoDaysAgo),
      isEmailValidated: false,
      isPhoneValidated: false
    });
  }
}
