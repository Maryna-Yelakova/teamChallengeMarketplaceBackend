import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/modules/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategys/local.strategy";
import { JwtStrategy } from "./strategys/jwt.strategy";
import { JwtRefreshStrategy } from "./strategys/jwt-refresh.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

import { CaslModule } from "src/casl/casl.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";

@Module({
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: "HS256"
      },
      verifyOptions: {
        algorithms: ["HS256"],
        ignoreExpiration: false
      }
    }),
    CaslModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
