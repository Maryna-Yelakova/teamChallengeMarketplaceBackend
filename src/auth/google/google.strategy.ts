import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>(process.env.GOOGLE_CLIENT_ID),
      clientSecret: configService.get<string>(process.env.GOOGLE_CLIENT_SECRET),
      callbackURL: configService.get<string>(process.env.GOOGLE_CALLBACK_URL),
      scope: ["email", "profile"],
      passReqToCallback: true // if your verify uses `req`
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    // your user lookup or creation logic here
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      googleId: profile.id
    };
    done(null, user);
  }
}
