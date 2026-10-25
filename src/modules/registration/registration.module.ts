import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { User } from "../../entities/user.entity";
import { RegistrationContact } from "../../entities/registration-contact.entity";
import { RefreshTokenSession } from "../../entities/refresh-token-session.entity";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { JwtRegistrationGuard } from "./registration.guard";
import { ContactAvailabilityGuard } from "./contact-availability.guard";

/** Owns the shared registration state machine, contact claims, and mobile token sessions. */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, RegistrationContact, RefreshTokenSession]),
    JwtModule.register({}),
    ConfigModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, JwtRegistrationGuard, ContactAvailabilityGuard],
  exports: [RegistrationService, JwtRegistrationGuard]
})
export class RegistrationModule {}
