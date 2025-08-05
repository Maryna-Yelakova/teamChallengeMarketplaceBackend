import { Controller, Post, Body, Res, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { ApiOperation } from "@nestjs/swagger";
import type { Request, Response } from "express";

import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { LoginUserDto } from "../users/dtos/login-user.dto";

// import { LocalAuthGuard } from "./local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @Post("register")
  register(@Res({ passthrough: true }) res: Response, @Body() createUserDto: CreateUserDto) {
    return this.authService.register(res, createUserDto);
  }

  @ApiOperation({ summary: "Login existing user" })
  @HttpCode(HttpStatus.OK)
  //@UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Res({ passthrough: true }) res: Response, @Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    return this.authService.login(res, email, password);
  }

  @ApiOperation({ summary: "Refresh user's credentions when access token expired" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as { userId: string };
    return this.authService.refresh(user.userId, res);
  }
}
