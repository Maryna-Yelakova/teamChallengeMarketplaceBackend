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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const category_entity_1 = require("../../entities/category.entity");
const swagger_1 = require("@nestjs/swagger");
let CategoriesController = class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    findAll() {
        return this.categoriesService.findAll();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create new category" }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Category successfully created',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiBadRequestResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all categories with subcategories" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of all categories with their subcategories',
        type: [category_entity_1.Category]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get category by id" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Category found successfully',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Category not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Category not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update category by id" }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Category updated successfully',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Category not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Category not found' },
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
                message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty'] },
                error: { type: 'string', example: 'Bad Request' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete category by id" }),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Category deleted successfully'
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Category not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Category not found' },
                error: { type: 'string', example: 'Not Found' }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category ID',
        type: 'string',
        format: 'uuid',
        example: '181fe998-8066-41e1-989b-71cd9a085a55'
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)("categories"),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map