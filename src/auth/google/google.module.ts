import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./google.strategy";
import { GoogleAuthController } from "./google.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy]
})
export class GoogleAuthModule {}
