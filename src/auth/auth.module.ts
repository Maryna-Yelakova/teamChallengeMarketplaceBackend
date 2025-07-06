import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: "HS256"
      },
      verifyOptions: {
        algorithms: ["HS256"],
        ignoreExpiration: false
      }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
