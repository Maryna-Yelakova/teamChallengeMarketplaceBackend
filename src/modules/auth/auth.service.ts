import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";

import type { Request, Response } from "express";
import { RegistrationService } from "../registration/registration.service";

/** Handles password login; registration and token rotation share one session service. */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private registrations: RegistrationService
  ) {}

  async register(_res: Response, dto: CreateUserDto) {
    return this.registrations.start(dto);
  }

  async login(_res: Response, identityString: string, password: string) {
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
      ...(await this.registrations.session(user))
    };
  }

  async logout(_res: Response, userId: string) {
    await this.registrations.revokeSessions(userId);
    return { message: "Logged out successfully" };
  }

  async refresh(userId: string, tokenId: string) {
    return this.registrations.rotateRefreshSession(userId, tokenId);
  }

  async validateUser(identityString: string, pass: string) {
    const user = identityString.includes("@")
      ? await this.usersService.findByEmail(identityString.trim().toLowerCase())
      : await this.usersService.findByPhone(identityString.trim());
    if (!user || user.registrationStatus !== "ACTIVE")
      throw new UnauthorizedException("Invalid credentials");

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }
}
