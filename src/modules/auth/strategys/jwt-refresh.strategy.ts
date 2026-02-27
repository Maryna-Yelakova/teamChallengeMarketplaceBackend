import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { extractRefreshToken } from "src/common/utils";
import { User } from "src/entities/user.entity";

import { Repository } from "typeorm";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  async validate(payload: { userId: string }) {
    if (!payload.userId) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersRepo.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException("User not found for the provided refresh token");
    }

    return { userId: payload.userId };
  }
}
