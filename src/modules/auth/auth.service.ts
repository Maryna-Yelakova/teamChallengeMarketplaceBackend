import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { JwtPayload } from "../../common/types";
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

  async register ( res: Response, dto: CreateUserDto )
  {
    const isDev = process.env.NODE_ENV === "development";
    const isSeller = dto.isSeller === true;

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        isDev
          ? {
            message: "Email already in use",
            reason: "EMAIL_ALREADY_IN_USE",
            field: "email"
          }
          : "Email already in use"
      );
    }

    const existingPhone = await this.usersService.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictException(
        isDev
          ? {
            message: "Phone number already in use",
            reason: "PHONE_ALREADY_IN_USE",
            field: "phone"
          }
          : "Phone number already in use"
      );
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      firstName: dto.firstName,
      phone: dto.phone,
      email: dto.email,
      password: hash,
      isPhoneValidated: false,
      isSeller
    });

    console.log(user);

    return { message: "User created", userId: user.id };
  }

  async login(res: Response, email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    const fullUser = await this.usersService.findById(user.id);
    if (!fullUser?.isPhoneValidated) {
      throw new UnauthorizedException("Please verify your phone number first");
    }

    return this.auth(res, user.id);
  }

  logout(res: Response) {
    setCookie(res, "", new Date(0));
    return { message: "Logged out successfully" };
  }

  refresh(userId: string, res: Response) {
    return this.auth(res, userId);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
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

  private auth(res: Response, id: string) {
    const { access_token, refresh_token } = this.generateTokens(id);
    setCookie(res, refresh_token, new Date(Date.now() + 1000 * 60 * 60 * 24));
    return { access_token };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException("New password must be different from current password");
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.usersService.update(userId, { password: hashedNewPassword });

    return { message: "Password changed successfully" };
  }

  private generateTokens(userId: string) {
    const payload: JwtPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_TOKEN_TTL }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_TOKEN_TTL })
    };
  }
}
