import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { extractRefreshToken } from "src/common/utils";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  validate(payload: { userId: string; exp: number }) {
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      throw new UnauthorizedException("Refresh token has expired");
    }
    return { userId: payload.userId };
  }
}
