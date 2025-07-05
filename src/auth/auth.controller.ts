import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        firstName: { type: "string", example: "Bob" },
        phone: { type: "string", example: "+380999912345" },
        email: { type: "string", example: "bob@mail.com" },
        password: { type: "string", example: "supersecret" }
      }
    }
  })
  @Post("register")
  register(@Res({ passthrough: true }) res: Response, @Body() dto: CreateUserDto) {
    return this.authService.register(res, dto);
  }

  @ApiOperation({ summary: "Login existing user" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "bob@mail.com" },
        password: { type: "string", example: "supersecret" }
      }
    }
  })
  @Post("login")
  login(@Res({ passthrough: true }) res: Response, @Body() dto: CreateUserDto) {
    const { email, password } = dto;
    return this.authService.login(res, email, password);
  }
}
