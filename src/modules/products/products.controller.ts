import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNoContentResponse,
  ApiBearerAuth,
  ApiForbiddenResponse
} from "@nestjs/swagger";
import { Product } from "src/entities/product.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RequestWithUser } from "../../common/types";

@ApiTags('Products')
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiCreatedResponse({ 
    description: 'Product successfully created',
    type: Product 
  })
  @ApiNotFoundResponse({
    description: 'Seller or subcategory not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Seller or subcategory not found' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty', 'price must be a number'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiBearerAuth("JWT-auth")
  @ApiForbiddenResponse({ description: "You can create products only for your own shop" })
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.user.userId, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products with seller and subcategory" })
  @ApiOkResponse({ 
    description: 'List of all products',
    type: [Product] 
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiOkResponse({ 
    description: 'Product found successfully',
    type: Product 
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product by ID" })
  @ApiOkResponse({ 
    description: 'Product updated successfully',
    type: Product 
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['price must be a number'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  @ApiBearerAuth("JWT-auth")
  @ApiForbiddenResponse({ description: "You can update only products in your own shop" })
  @UseGuards(JwtAuthGuard)
  update(@Req() req: RequestWithUser, @Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, req.user.userId, updateProductDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product by ID" })
  @ApiNoContentResponse({ 
    description: 'Product deleted successfully' 
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  @ApiBearerAuth("JWT-auth")
  @ApiForbiddenResponse({ description: "You can delete only products in your own shop" })
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.productsService.remove(id, req.user.userId);
  }
}
