import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IdentityWay } from "src/common/types";
import { UsersService } from "src/modules/users/users.service";
//import { JwtPayload } from "src/common/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET") // краще з .env
    });
  }

  async validate(payload: { userId: string; identityWay: IdentityWay; exp: number }) {
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      throw new UnauthorizedException("Access token has expired");
    }

    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.isPhoneValidated && payload.identityWay === "phone") {
      throw new UnauthorizedException("Please verify your phone number first");
    }

    if (!user.isEmailValidated && payload.identityWay === "email") {
      throw new UnauthorizedException("Please verify your email first");
    }

    if (user.isSeller) {
      if (!(user.isPhoneValidated && user.isEmailValidated)) {
        throw new UnauthorizedException("Please verify your email and phone number first");
      }
    }

    return { userId: payload.userId };
  }
}
