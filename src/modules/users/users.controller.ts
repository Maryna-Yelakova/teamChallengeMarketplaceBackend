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

  @ApiOperation({ summary: "Get user by ID" })
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async getUserById(@Param("id") id: string) {
    const user = await this.UsersService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  @ApiOperation({ summary: "Delete user" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.UsersService.delete(id);
  }

  @ApiOperation({ summary: "Update a specific user" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUsersDto) {
    return await this.UsersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "Change user's phone number" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @ApiBearerAuth()
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
