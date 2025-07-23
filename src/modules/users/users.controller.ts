import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUsersDto } from "./dtos/update-user.dto";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param("id") id: string) {
    return await this.UsersService.findById(id);
  }

  @ApiOperation({ summary: "Delete user" })
  @ApiParam({
    name: "id",
    description: "The unique user's ID",
    type: String,
    example: "181fe998-8066-41e1-989b-71cd9a085a55"
  })
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
  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUsersDto) {
    return await this.UsersService.update(id, updateUserDto);
  }
}
