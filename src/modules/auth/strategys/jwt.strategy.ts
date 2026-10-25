import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory";
import { AppAbility } from "src/modules/casl/casl-ability.types";
import { IdentityWay } from "src/common/types";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
//import { JwtPayload } from "src/common/types";

/** Keeps pending-registration and refresh tokens out of protected application routes. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private configService: ConfigService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET")
    });
  }

  async validate(payload: {
    userId: string;
    identityWay?: IdentityWay;
    tokenType?: string;
    tokenVersion?: number;
    exp: number;
  }) {
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      throw new UnauthorizedException("Access token has expired");
    }

    if (payload.tokenType === "registration" || payload.tokenType === "refresh") {
      throw new UnauthorizedException("Registration or refresh session is not an access token");
    }
    const user = await this.usersRepo.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    if (payload.tokenVersion !== undefined && user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException("Access token has been revoked");
    }

    if (user.registrationStatus !== "ACTIVE")
      throw new UnauthorizedException("Account is not active");
    if (user.isSeller) {
      if (!(user.isPhoneValidated && user.isEmailValidated)) {
        throw new UnauthorizedException("Please verify your email and phone number first");
      }
    }

    if (!user.isPhoneValidated && payload.identityWay === "phone") {
      throw new UnauthorizedException("Please verify your phone number first");
    }

    if (!user.isEmailValidated && payload.identityWay === "email") {
      throw new UnauthorizedException("Please verify your email first");
    }

    const ability: AppAbility = this.caslAbilityFactory.createForUser(user);

    return { userId: payload.userId, identityWay: payload.identityWay, ability };
  }
}
