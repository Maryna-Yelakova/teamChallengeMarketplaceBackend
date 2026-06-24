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
exports.SellersController = void 0;
const common_1 = require("@nestjs/common");
const sellers_service_1 = require("./sellers.service");
const create_seller_dto_1 = require("./dto/create-seller.dto");
const update_seller_dto_1 = require("./dto/update-seller.dto");
const seller_entity_1 = require("../../entities/seller.entity");
const swagger_1 = require("@nestjs/swagger");
let SellersController = class SellersController {
    sellersService;
    constructor(sellersService) {
        this.sellersService = sellersService;
    }
    create(createSellerDto) {
        return this.sellersService.create(createSellerDto);
    }
    findOne(id) {
        return this.sellersService.findOne(id);
    }
    update(id, updateSellerDto) {
        return this.sellersService.update(id, updateSellerDto);
    }
    remove(id) {
        return this.sellersService.remove(id);
    }
};
exports.SellersController = SellersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create seller" }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Seller successfully created',
        type: seller_entity_1.Seller
    }),
    (0, swagger_1.ApiBadRequestResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seller_dto_1.CreateSellerDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get seller by Id" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Seller found successfully',
        type: seller_entity_1.Seller
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Seller not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Seller not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Seller ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update seller" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Seller updated successfully',
        type: seller_entity_1.Seller
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Seller not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Seller not found' },
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
                message: { type: 'array', items: { type: 'string' }, example: ['shopName should not be empty'] },
                error: { type: 'string', example: 'Bad Request' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Seller ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_seller_dto_1.UpdateSellerDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete seller by ID" }),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Seller deleted successfully'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Seller not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Seller not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Seller ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "remove", null);
exports.SellersController = SellersController = __decorate([
    (0, swagger_1.ApiTags)('Sellers'),
    (0, common_1.Controller)("sellers"),
    __metadata("design:paramtypes", [sellers_service_1.SellersService])
], SellersController);
//# sourceMappingURL=sellers.controller.js.map