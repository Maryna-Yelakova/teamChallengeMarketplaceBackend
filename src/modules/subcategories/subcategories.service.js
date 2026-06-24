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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcategory_entity_1 = require("../../entities/subcategory.entity");
const categories_service_1 = require("../categories/categories.service");
let SubcategoriesService = class SubcategoriesService {
    subcategoryRepo;
    categoriesService;
    constructor(subcategoryRepo, categoriesService) {
        this.subcategoryRepo = subcategoryRepo;
        this.categoriesService = categoriesService;
    }
    async create(dto) {
        const category = await this.categoriesService.findOne(dto.categoryId);
        if (!category)
            throw new common_1.NotFoundException(`Category ${dto.categoryId} not found`);
        let parentSubcategory = null;
        if (dto.parentSubcategoryId) {
            parentSubcategory = await this.subcategoryRepo.findOneBy({ id: dto.parentSubcategoryId });
            if (!parentSubcategory)
                throw new common_1.NotFoundException(`Parent subcategory ${dto.parentSubcategoryId} not found`);
        }
        const subcategory = this.subcategoryRepo.create(dto);
        return this.subcategoryRepo.save(subcategory);
    }
    findAll() {
        return this.subcategoryRepo.find({
            relations: ["category", "parentSubcategory", "children"]
        });
    }
    async findOne(id) {
        const subcategory = await this.subcategoryRepo.findOne({
            where: { id },
            relations: ["category", "parentSubcategory", "children"]
        });
        if (!subcategory)
            throw new common_1.NotFoundException(`Subcategory ${id} not found`);
        return subcategory;
    }
    async update(id, dto) {
        const subcategory = await this.findOne(id);
        if (dto.categoryId) {
            const category = await this.categoriesService.findOne(dto.categoryId);
            if (!category)
                throw new common_1.NotFoundException(`Category ${dto.categoryId} not found`);
            subcategory.category = category;
        }
        if (dto.parentSubcategoryId) {
            const parentSubcategory = await this.subcategoryRepo.findOneBy({
                id: dto.parentSubcategoryId
            });
            if (!parentSubcategory)
                throw new common_1.NotFoundException(`Parent subcategory ${dto.parentSubcategoryId} not found`);
            subcategory.parentSubcategory = parentSubcategory;
        }
        Object.assign(subcategory, dto);
        return this.subcategoryRepo.save(subcategory);
    }
    async remove(id) {
        const subcategory = await this.findOne(id);
        await this.subcategoryRepo.remove(subcategory);
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService])
], SubcategoriesService);
//# sourceMappingURL=subcategories.service.js.map