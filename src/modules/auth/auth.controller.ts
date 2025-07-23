import { Controller, Post, Body, Res, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import type { Request, Response } from "express";

import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
// import { LocalAuthGuard } from "./local-auth.guard";

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
  @HttpCode(HttpStatus.OK)
  //@UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Res({ passthrough: true }) res: Response, @Body() dto: CreateUserDto) {
    const { email, password } = dto;
    return this.authService.login(res, email, password);
  }

  @ApiOperation({ summary: "Refresh user's credentions when access token expired" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }
}
