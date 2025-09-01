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
import { ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get("/:id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiBearerAuth()
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
    const user = await this.UsersService.findByEmail(phone);
    return { isPresent: !!user };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    await this.UsersService.delete(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a specific user" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUsersDto) {
    return await this.UsersService.update(id, updateUserDto);
  }

  @Patch(":id/change-phone")
  @ApiOperation({ summary: "Change user's phone number" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
