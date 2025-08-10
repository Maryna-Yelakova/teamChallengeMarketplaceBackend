import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SellersService } from "./sellers.service";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("sellers")
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: "Create seller", description: "In progress" })
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get seller by Id", description: "In progress" })
  findOne(@Param("id") id: string) {
    return this.sellersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update seller", description: "In progress" })
  update(@Param("id") id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(id, updateSellerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.sellersService.remove(id);
  }
}
