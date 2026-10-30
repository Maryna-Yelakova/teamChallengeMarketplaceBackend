import { Controller, Post, Body, Res, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";

import {
  ApiOperation,
  // ApiResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody
} from "@nestjs/swagger";

import type { Request, Response } from "express";
import { RequestWithUser } from "../../common/types";

import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

import { LoginUserDto } from "../users/dtos/login-user.dto";
import { Public } from "./decorators/public.decorator";
import { CheckPolicies } from "src/modules/casl/decorators/check-policies.decorator";
import { Action, AppAbility } from "src/modules/casl/casl-ability.types";
import { User } from "src/entities/user.entity";

// import { LocalAuthGuard } from "./local-auth.guard";

/** Mobile auth returns JSON tokens and the backend's current registration state. */
@ApiTags("Auth")
@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiCreatedResponse({
    description:
      "Pending registration session created; save the refresh token securely on the mobile device",
    schema: {
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        registrationState: {
          type: "object",
          description: "Current verification state and next action"
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Registration form validation error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          type: "array",
          items: { type: "string" },
          example: [
            "email must be an email",
            "password must be longer than or equal to 6 characters"
          ]
        },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @ApiConflictResponse({
    description: "Verified contacts already belong to another account; no pending user is created",
    schema: {
      type: "object",
      properties: {
        code: { type: "string", example: "CONTACT_ALREADY_IN_USE" },
        fieldErrors: {
          type: "object",
          example: { email: ["This contact is already linked to another account."] }
        }
      }
    }
  })
  @Public()
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
        userId: { type: "string", format: "uuid" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        registrationState: { type: "object" }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    content: {
      "application/json": {
        examples: {
          invalidCredentials: {
            summary: "Invalid credentials",
            value: { statusCode: 401, message: "Invalid credentials", error: "Unauthorized" }
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
  @Public()
  @Post("login")
  login(@Res({ passthrough: true }) res: Response, @Body() loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;
    return this.authService.login(res, identifier, password);
  }

  @ApiOperation({ summary: "Logout user" })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @Post("logout")
  logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res, req.user.userId);
  }

  @ApiOperation({
    summary: "Exchange a mobile refresh token for rotated JSON tokens and registration state"
  })
  @ApiOkResponse({
    description: "Tokens successfully refreshed",
    schema: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        registrationState: { type: "object" }
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
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(JwtRefreshGuard)
  @ApiBody({
    schema: {
      type: "object",
      required: ["refreshToken"],
      properties: { refreshToken: { type: "string" } }
    }
  })
  @Post("refresh")
  refresh(@Req() req: RequestWithUser) {
    return this.authService.refresh(req.user.userId, req.user.tokenId!);
  }
}
