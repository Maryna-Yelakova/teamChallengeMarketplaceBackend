import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SellersService } from "./sellers.service";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { Seller } from "../../entities/seller.entity";
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

@ApiTags('Sellers')
@Controller("sellers")
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: "Create seller" })
  @ApiCreatedResponse({ 
    description: 'Seller successfully created',
    type: Seller 
  })
  @ApiBadRequestResponse({
    description: 'Validation error or seller already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          oneOf: [
            { type: 'string', example: 'Shop name already exists' },
            { type: 'array', items: { type: 'string' }, example: ['shopName should not be empty', 'userId must be a UUID'] }
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get seller by Id" })
  @ApiOkResponse({ 
    description: 'Seller found successfully',
    type: Seller 
  })
  @ApiNotFoundResponse({
    description: 'Seller not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Seller not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Seller ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  findOne(@Param("id") id: string) {
    return this.sellersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update seller" })
  @ApiOkResponse({ 
    description: 'Seller updated successfully',
    type: Seller 
  })
  @ApiNotFoundResponse({
    description: 'Seller not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Seller not found' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['shopName should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Seller ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  update(@Param("id") id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(id, updateSellerDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete seller by ID" })
  @ApiNoContentResponse({ 
    description: 'Seller deleted successfully' 
  })
  @ApiNotFoundResponse({
    description: 'Seller not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Seller not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Seller ID',
    type: 'string',
    format: 'uuid',
    example: '181fe998-8066-41e1-989b-71cd9a085a55'
  })
  remove(@Param("id") id: string) {
    return this.sellersService.remove(id);
  }
}
