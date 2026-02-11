import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUsersDto } from "./dtos/update-user.dto";
import { ChangePhoneDto } from "./dtos/change-phone.dto";
import { 
  ApiBody,
  ApiBearerAuth, 
  ApiOperation, 
  ApiParam, 
  ApiQuery,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RequestWithUser } from "../../common/types";
import { UpgradeToSellerDto } from "./dtos/upgrade-to-seller.dto";

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

  @Get("iep")
  @ApiOperation({ summary: "Is email present?" })
  @ApiQuery({
    name: "email",
    description: "The user's email",
    type: String,
    required: true,
    example: "myemail@mail.com"
  })
  async isEmailPresent(@Query("email") email: string) {
    if (!email) {
      throw new BadRequestException("Query parameter 'email' is required");
    }
    const user = await this.UsersService.findByEmail(email);
    return { isPresent: !!user };
  }

  @Get("ipp")
  @ApiOperation({ summary: "Is phone present?" })
  @ApiQuery({
    name: "phone",
    description: "The user's phone number",
    type: String,
    required: true,
    example: "+380501234567"
  })
  async isPhonePresent(@Query("phone") phone: string) {
    if (!phone) {
      throw new BadRequestException("Query parameter 'phone' is required");
    }
    const user = await this.UsersService.findByPhone(phone);
    return { isPresent: !!user };
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
  async delete(@Req() req: RequestWithUser, @Param("id") id: string) {
    if (req.user.userId !== id) {
      throw new ForbiddenException("You can only manage your own account");
    }
    await this.UsersService.delete(id);
  }

  @Patch("become-seller")
  @ApiOperation({ summary: "Upgrade current user account to seller" })
  @ApiBody({ type: UpgradeToSellerDto })
  @ApiOkResponse({
    description: "Account upgraded to seller successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Account upgraded to seller" },
        user: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
            firstName: { type: "string", example: "Василь" },
            email: { type: "string", example: "basilbasilyuk@mail.gov" },
            phone: { type: "string", example: "+380991234567" },
            isSeller: { type: "boolean", example: true }
          }
        },
        seller: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
            userId: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
            shopName: { type: "string", example: "My Amazing Shop" },
            legalAddress: { type: "string", nullable: true, example: "123 Main St, Kiev, Ukraine" },
            taxId: { type: "string", nullable: true, example: "12345678901" },
            phone: { type: "string", nullable: true, example: "+380991234567" },
            description: { type: "string", nullable: true, example: "We sell quality products" },
            createdAt: { type: "string", format: "date-time" }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "User is already a seller or validation error",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          oneOf: [
            { type: "string", example: "User is already a seller" },
            {
              type: "array",
              items: { type: "string" },
              example: ["shopName should not be empty"]
            }
          ]
        },
        error: { type: "string", example: "Bad Request" }
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
  @UseGuards(JwtAuthGuard)
  async becomeSeller(@Req() req: RequestWithUser, @Body() dto: UpgradeToSellerDto) {
    return await this.UsersService.upgradeToSeller(req.user.userId, dto);
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
  async updateUser(@Req() req: RequestWithUser, @Param("id") id: string, @Body() updateUserDto: UpdateUsersDto) {
    if (req.user.userId !== id) {
      throw new ForbiddenException("You can only manage your own account");
    }
    return await this.UsersService.update(id, updateUserDto);
  }

  @Patch(":id/change-phone")
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
  async changePhone(@Req() req: RequestWithUser, @Param("id") id: string, @Body() changePhoneDto: ChangePhoneDto) {
    if (req.user.userId !== id) {
      throw new ForbiddenException("You can only manage your own account");
    }

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
