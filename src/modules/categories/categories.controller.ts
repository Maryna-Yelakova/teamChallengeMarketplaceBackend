import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "../../entities/category.entity";
import { 
  ApiOperation, 
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNoContentResponse
} from "@nestjs/swagger";

@ApiTags('Categories')
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create new category" })
  @ApiCreatedResponse({ 
    description: 'Category successfully created',
    type: Category 
  })
  @ApiBadRequestResponse({
    description: 'Validation error or category already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          oneOf: [
            { type: 'string', example: 'Category with this name already exists' },
            { type: 'array', items: { type: 'string' }, example: ['name should not be empty'] }
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories with subcategories" })
  @ApiOkResponse({ 
    description: 'List of all categories with their subcategories',
    type: [Category] 
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by id" })
  @ApiOkResponse({ 
    description: 'Category found successfully',
    type: Category 
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update category by id" })
  @ApiOkResponse({ 
    description: 'Category updated successfully',
    type: Category 
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete category by id" })
  @ApiNoContentResponse({ 
    description: 'Category deleted successfully' 
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
