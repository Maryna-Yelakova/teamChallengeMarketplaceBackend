import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { extractRefreshToken } from "src/common/utils";
import { User } from "src/entities/user.entity";
import { RefreshTokenSession } from "src/entities/refresh-token-session.entity";

import { Repository } from "typeorm";

/** Accepts only refresh tokens whose version and persisted session are still valid. */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(RefreshTokenSession)
    private readonly sessionsRepo: Repository<RefreshTokenSession>,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  async validate(payload: {
    userId: string;
    identityWay?: string;
    tokenType?: string;
    tokenVersion?: number;
    tokenId?: string;
  }) {
    if (
      !payload.userId ||
      payload.tokenType !== "refresh" ||
      typeof payload.tokenVersion !== "number" ||
      !payload.tokenId
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersRepo.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException("User not found for the provided refresh token");
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }
    const session = await this.sessionsRepo.findOneBy({
      userId: payload.userId,
      tokenId: payload.tokenId
    });
    if (!session || session.expiresAt.getTime() <= Date.now())
      throw new UnauthorizedException("Refresh token has been revoked or expired");

    return { userId: payload.userId, identityWay: payload.identityWay, tokenId: payload.tokenId };
  }
}
