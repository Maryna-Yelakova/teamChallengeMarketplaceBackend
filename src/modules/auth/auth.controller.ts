import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Patch
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";

import { ChangePasswordDto } from "./dtos/change-password.dto";

import {
  ApiBody,
  ApiOperation,
  // ApiResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags
} from "@nestjs/swagger";

import type { Request, Response } from "express";
import { RequestWithUser } from "../../common/types";

import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";

import { LoginUserDto } from "../users/dtos/login-user.dto";

// import { LocalAuthGuard } from "./local-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiCreatedResponse({
    description: "User successfully registered",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
        firstName: { type: "string", example: "Василь" },
        email: { type: "string", example: "basilbasilyuk@mail.gov" },
        phone: { type: "string", example: "+380991234567" },
        isSeller: { type: "boolean", example: false },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Validation error or user already exists",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          oneOf: [
            { type: "string", example: "User with this email already exists" },
            {
              type: "array",
              items: { type: "string" },
              example: [
                "email must be an email",
                "password must be longer than or equal to 6 characters"
              ]
            }
          ]
        },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @Post("register")
  register(@Res({ passthrough: true }) res: Response, @Body() createUserDto: CreateUserDto) {
    return this.authService.register(res, createUserDto);
  }

  @ApiOperation({ summary: "Login existing user" })
  @ApiOkResponse({
    description: "User successfully logged in",
    schema: {
      type: "object",
      properties: {
        isPhoneValidated: { type: "boolean", example: false },
        isEmailValidated: { type: "boolean", example: false },
        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials or unverified phone/email",
    content: {
      "application/json": {
        examples: {
          invalidCredentials: {
            summary: "Invalid credentials",
            value: { statusCode: 401, message: "Invalid credentials", error: "Unauthorized" }
          },
          phoneNotVerified: {
            summary: "Phone not verified",
            value: {
              statusCode: 401,
              message: "Please verify your phone number first",
              error: "Unauthorized"
            }
          },
          emailNotVerified: {
            summary: "Email not verified",
            value: {
              statusCode: 401,
              message: "Please verify your email first",
              error: "Unauthorized"
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Validation error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", items: { type: "string" }, example: ["email must be an email"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  //@UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Res({ passthrough: true }) res: Response, @Body() loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;
    return this.authService.login(res, identifier, password);
  }

  @ApiOperation({ summary: "Logout user" })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOperation({ summary: "Refresh user's credentions when access token expired" })
  @ApiOkResponse({
    description: "Tokens successfully refreshed",
    schema: {
      type: "object",
      properties: {
        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Invalid refresh token",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Invalid refresh token" },
        error: { type: "string", example: "Unauthorized" }
      }
    }
  })
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  refresh(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req.user.userId, res);
  }

  @ApiOperation({ summary: "Change user password" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        currentPassword: { type: "string", example: "oldpassword" },
        newPassword: { type: "string", example: "newpassword" }
      }
    }
  })
  @ApiOkResponse({
    description: "Password successfully changed",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Password changed successfully" }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Invalid current password or validation error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          oneOf: [
            { type: "string", example: "Current password is incorrect" },
            {
              type: "array",
              items: { type: "string" },
              example: ["newPassword must be longer than or equal to 6 characters"]
            }
          ]
        },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
        error: { type: "string", example: "Unauthorized" }
      }
    }
  })
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(@Req() req: RequestWithUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }
}
