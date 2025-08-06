import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { extractRefreshToken } from "src/common/utils";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  async validate(payload: { userId: string }) {
    if (!payload.userId) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException("User not found for the provided refresh token");
    }

    return { userId: payload.userId };
  }
}
