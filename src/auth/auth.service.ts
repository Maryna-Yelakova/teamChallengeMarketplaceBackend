import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";

interface IJwtPeyload {
  id: string;
}

@Injectable()
export class AuthService {
  private JWT_SECRET: string;
  private JWT_ACCESS_TOKEN_TTL: string;
  private JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private conficService: ConfigService
  ) {
    this.JWT_SECRET = conficService.getOrThrow<string>("JWT_SECRET");
    this.JWT_ACCESS_TOKEN_TTL = conficService.getOrThrow<string>("JWT_ACCESS_TOKEN_TTL");
    this.JWT_REFRESH_TOKEN_TTL = conficService.getOrThrow<string>("JWT_REFRESH_TOKEN_TTL");
  }

  async register(res: Response, dto: CreateUserDto) {
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

    return this.auth(res, user.id);
  }

  async login(res: Response, email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return this.auth(res, user.id);
  }

  refresh(req: Request, res: Response) {
    if (typeof req.cookies["refresh_token"] !== "string") {
      throw new UnauthorizedException({ message: "Refresh token is missing or must by a string" });
    }

    const refreshToken: string = req.cookies["refresh_token"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    const payload: IJwtPeyload = this.jwtService.verify(refreshToken);

    return this.auth(res, payload.id);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Email or password wrong");
    }

    return user;
  }

  private auth(res: Response, id: string) {
    const { access_token, refresh_token } = this.generateTokens(id);
    this.setCookie(res, refresh_token, new Date(Date.now() + 1000 * 60 * 60 * 24));
    return { access_token };
  }

  private generateTokens(userId: string) {
    const payload: IJwtPeyload = { id: userId };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_TOKEN_TTL }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_TOKEN_TTL })
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie("refresh_token", value, {
      httpOnly: true,
      expires
    });
  }
}
