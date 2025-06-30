import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already in use");

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hash,
      firstName: dto.firstName,
      phone: dto.phone
    });

    console.log(user);

    return this.signToken(user.id, user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return this.signToken(user.id, user.email);
  }

  private async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
