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
exports.SubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const subcategories_service_1 = require("./subcategories.service");
const create_subcategory_dto_1 = require("./dto/create-subcategory.dto");
const update_subcategory_dto_1 = require("./dto/update-subcategory.dto");
const swagger_1 = require("@nestjs/swagger");
const subcategory_entity_1 = require("../../entities/subcategory.entity");
let SubcategoriesController = class SubcategoriesController {
    subcategoriesService;
    constructor(subcategoriesService) {
        this.subcategoriesService = subcategoriesService;
    }
    create(createSubcategoryDto) {
        return this.subcategoriesService.create(createSubcategoryDto);
    }
    findAll() {
        return this.subcategoriesService.findAll();
    }
    findOne(id) {
        return this.subcategoriesService.findOne(id);
    }
    update(id, updateSubcategoryDto) {
        return this.subcategoriesService.update(id, updateSubcategoryDto);
    }
    remove(id) {
        return this.subcategoriesService.remove(id);
    }
};
exports.SubcategoriesController = SubcategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new subcategory" }),
    (0, swagger_1.ApiResponse)({ status: 201, type: subcategory_entity_1.Subcategory }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Category or parent subcategory not found" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all subcategories" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [subcategory_entity_1.Subcategory] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get subcategory by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: subcategory_entity_1.Subcategory }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Subcategory not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update subcategory by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: subcategory_entity_1.Subcategory }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Subcategory or category not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete subcategory by ID" }),
    (0, swagger_1.ApiResponse)({ status: 204 }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "remove", null);
exports.SubcategoriesController = SubcategoriesController = __decorate([
    (0, common_1.Controller)("subcategories"),
    __metadata("design:paramtypes", [subcategories_service_1.SubcategoriesService])
], SubcategoriesController);
//# sourceMappingURL=subcategories.controller.js.map