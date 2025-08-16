import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SubcategoriesService } from "./subcategories.service";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Subcategory } from "../../entities/subcategory.entity";

@Controller("subcategories")
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new subcategory" })
  @ApiResponse({ status: 201, type: Subcategory })
  @ApiResponse({ status: 404, description: "Category or parent subcategory not found" })
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all subcategories" })
  @ApiResponse({ status: 200, type: [Subcategory] })
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subcategory by ID" })
  @ApiResponse({ status: 200, type: Subcategory })
  @ApiResponse({ status: 404, description: "Subcategory not found" })
  findOne(@Param("id") id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update subcategory by ID" })
  @ApiResponse({ status: 200, type: Subcategory })
  @ApiResponse({ status: 404, description: "Subcategory or category not found" })
  update(@Param("id") id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete subcategory by ID" })
  @ApiResponse({ status: 204 })
  remove(@Param("id") id: string) {
    return this.subcategoriesService.remove(id);
  }
}
