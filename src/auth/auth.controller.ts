import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiBody({
    schema: {
      type: "CreateUserDto",
      properties: {
        firstName: { type: "string", example: "Bob" },
        phone: { type: "string", example: "+380999912345" },
        email: { type: "string", example: "bob@mail.com" },
        password: { type: "string", example: "supersecret" }
      }
    }
  })
  @Post("register")
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
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
  login(@Body() dto: CreateUserDto) {
    const { email, password } = dto;
    return this.authService.login(email, password);
  }
}
