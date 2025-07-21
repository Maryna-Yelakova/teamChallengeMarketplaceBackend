import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
//import { JwtPayload } from "src/common/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  validate(payload: { userId: string; exp: number }) {
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      throw new UnauthorizedException("Access token has expired");
    }
    return { userId: payload.userId };
  }
}
