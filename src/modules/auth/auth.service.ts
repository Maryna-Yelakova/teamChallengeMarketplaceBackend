import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";

import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { IdentityWay, JwtPayload } from "../../common/types";
import { setCookie } from "src/common/utils";

@Injectable()
export class AuthService {
  private JWT_ACCESS_TOKEN_TTL: string;
  private JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>("JWT_ACCESS_TOKEN_TTL");
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>("JWT_REFRESH_TOKEN_TTL");
  }

  async register(res: Response, dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already in use");

    const existingPhone = await this.usersService.findByPhone(dto.phone);
    if (existingPhone) throw new ConflictException("Phone number already in use");

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      ...dto,
      password: hash
    });

    console.log(user);

    return { message: "User created", userId: user.id };
  }

  async login(res: Response, identityString: string, password: string) {
    const user = await this.validateUser(identityString, password);
    if (!user) throw new UnauthorizedException();

    // const fullUser = await this.usersService.findById(user.id);
    // if (!fullUser?.isPhoneValidated) {
    //   throw new UnauthorizedException("Please verify your phone number first");
    // }

    // if (!fullUser?.isEmailValideted) {
    //   throw new UnauthorizedException("Please verify your email first");
    // }

    return {
      isPhoneValidated: user.isPhoneValidated,
      isEmailValidated: user.isEmailValidated,
      accessToken: this.auth(res, user.id, identityString.includes("@") ? "email" : "phone")
    };
  }

  logout(res: Response) {
    setCookie(res, "", new Date(0));
    return { message: "Logged out successfully" };
  }

  refresh(userId: string, res: Response) {
    return { accessToken: this.auth(res, userId) };
  }

  async validateUser(identityString: string, pass: string) {
    const user = identityString.includes("@")
      ? await this.usersService.findByEmail(identityString)
      : await this.usersService.findByPhone(identityString);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Email or password wrong");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  private auth(res: Response, id: string, identityWay: IdentityWay = "email") {
    const { access_token, refresh_token } = this.generateTokens(id, identityWay);
    setCookie(res, refresh_token, new Date(Date.now() + 1000 * 60 * 60 * 24));
    return access_token;
  }

  private generateTokens(userId: string, identityWay: IdentityWay) {
    const payload: JwtPayload = { userId, identityWay };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_TOKEN_TTL }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_TOKEN_TTL })
    };
  }
}
