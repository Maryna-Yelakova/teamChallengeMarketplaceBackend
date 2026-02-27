import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUsersDto } from "./dtos/update-user.dto";
import { ChangePhoneDto } from "./dtos/change-phone.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody
} from "@nestjs/swagger";
// import { User } from "src/entities/user.entity";
import { AppAbility } from "src/casl/casl-ability.types";

import { Ability } from "src/casl/decorators/ability.decorator";
import { RequestWithUser } from "src/common/types";
import { ChangePasswordDto } from "../auth/dtos/change-password.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get("/:id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiOkResponse({
    description: "User found successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
        firstName: { type: "string", example: "Василь" },
        email: { type: "string", example: "basilbasilyuk@mail.gov" },
        phone: { type: "string", example: "+380991234567" },
        isPhoneValidated: { type: "boolean", example: false },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "User not found",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "User not found" },
        error: { type: "string", example: "Not Found" }
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
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  async getUserById(@Param("id") id: string, @Ability() ability: AppAbility) {
    return await this.UsersService.findById(id, ability);
  }

  @Get("iep")
  @ApiOperation({ summary: "Is email present?" })
  @ApiParam({
    name: "email",
    description: "The user's email",
    type: String,
    example: "myemail@mail.com"
  })
  async isEmailPresent(@Param("email") email: string) {
    const user = await this.UsersService.findByEmail(email);
    return { isPresent: !!user };
  }

  @Get("ipp")
  @ApiOperation({ summary: "Is phone present?" })
  @ApiParam({
    name: "phone",
    description: "The user's phone number",
    type: String,
    example: "+380501234567"
  })
  async isPhonePresent(@Param("phone") phone: string) {
    const user = await this.UsersService.findByPhone(phone);
    return { isPresent: !!user };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiOkResponse({
    description: "User deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "User deleted successfully" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "User not found",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "User not found" },
        error: { type: "string", example: "Not Found" }
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
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth("JWT-auth")
  async delete(@Param("id") id: string, @Ability() ability: AppAbility) {
    await this.UsersService.delete(id, ability);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a specific user" })
  @ApiOkResponse({
    description: "User updated successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
        firstName: { type: "string", example: "Василь" },
        email: { type: "string", example: "basilbasilyuk@mail.gov" },
        phone: { type: "string", example: "+380991234567" },
        isPhoneValidated: { type: "boolean", example: false },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "User not found",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "User not found" },
        error: { type: "string", example: "Not Found" }
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
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth("JWT-auth")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUsersDto,
    @Ability() ability: AppAbility
  ) {
    return await this.UsersService.update(id, updateUserDto, ability);
  }

  @Patch(":id/change-phone")
  @ApiOperation({ summary: "Change user's phone number" })
  @ApiOkResponse({
    description: "Phone number changed successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
        firstName: { type: "string", example: "Василь" },
        email: { type: "string", example: "basilbasilyuk@mail.gov" },
        phone: { type: "string", example: "+380501234567" },
        isPhoneValidated: { type: "boolean", example: false },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "User not found",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "User not found" },
        error: { type: "string", example: "Not Found" }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Validation error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          type: "array",
          items: { type: "string" },
          example: ["newPhone must be in international format"]
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
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth("JWT-auth")
  async changePhone(
    @Param("id") id: string,
    @Body() changePhoneDto: ChangePhoneDto,
    @Ability() ability: AppAbility
  ) {
    const updatedUser = await this.UsersService.changePhone(id, changePhoneDto.newPhone, ability);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
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
  @Patch("change-password")
  changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
    @Ability() ability: AppAbility
  ) {
    return this.UsersService.changePassword(req.user.userId, dto, ability);
  }
}
