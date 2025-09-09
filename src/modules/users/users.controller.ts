import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards
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
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags('Users')
@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get("/:id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiOkResponse({
    description: 'User found successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '181fe998-8066-41e1-989b-71cd9a085a55' },
        firstName: { type: 'string', example: 'Василь' },
        email: { type: 'string', example: 'basilbasilyuk@mail.gov' },
        phone: { type: 'string', example: '+380991234567' },
        isPhoneValidated: { type: 'boolean', example: false },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param("id") id: string) {
    const user = await this.UsersService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    await this.UsersService.delete(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a specific user" })
  @ApiOkResponse({
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '181fe998-8066-41e1-989b-71cd9a085a55' },
        firstName: { type: 'string', example: 'Василь' },
        email: { type: 'string', example: 'basilbasilyuk@mail.gov' },
        phone: { type: 'string', example: '+380991234567' },
        isPhoneValidated: { type: 'boolean', example: false },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['email must be an email'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUsersDto) {
    return await this.UsersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "Change user's phone number" })
  @ApiOkResponse({
    description: 'Phone number changed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '181fe998-8066-41e1-989b-71cd9a085a55' },
        firstName: { type: 'string', example: 'Василь' },
        email: { type: 'string', example: 'basilbasilyuk@mail.gov' },
        phone: { type: 'string', example: '+380501234567' },
        isPhoneValidated: { type: 'boolean', example: false },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['newPhone must be in international format'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(":id/change-phone")
  async changePhone(@Param("id") id: string, @Body() changePhoneDto: ChangePhoneDto) {
    const user = await this.UsersService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.UsersService.changePhone(id, changePhoneDto.newPhone);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }
}
