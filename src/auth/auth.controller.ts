import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
