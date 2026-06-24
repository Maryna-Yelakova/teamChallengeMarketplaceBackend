"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("../../entities/product.entity");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll() {
        return this.productsService.findAll();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new product" }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Product successfully created',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Seller or subcategory not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Seller or subcategory not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty', 'price must be a number'] },
                error: { type: 'string', example: 'Bad Request' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all products with seller and subcategory" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of all products',
        type: [product_entity_1.Product]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get product by ID" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Product found successfully',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Product not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Product not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update product by ID" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Product updated successfully',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Product not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Product not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'array', items: { type: 'string' }, example: ['price must be a number'] },
                error: { type: 'string', example: 'Bad Request' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete product by ID" }),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Product deleted successfully'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Product not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Product not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)("products"),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map