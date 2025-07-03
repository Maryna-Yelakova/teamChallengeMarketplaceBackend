import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUsersDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async create(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    return await this.usersRepo.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
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
}
