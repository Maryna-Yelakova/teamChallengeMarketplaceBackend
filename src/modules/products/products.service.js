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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../entities/product.entity");
const sellers_service_1 = require("../sellers/sellers.service");
const subcategories_service_1 = require("../subcategories/subcategories.service");
let ProductsService = class ProductsService {
    productsRepo;
    sellersService;
    subcategoriesService;
    constructor(productsRepo, sellersService, subcategoriesService) {
        this.productsRepo = productsRepo;
        this.sellersService = sellersService;
        this.subcategoriesService = subcategoriesService;
    }
    async create({ sellerId, subcategoryId, ...rest }) {
        const seller = await this.sellersService.findOne(sellerId);
        if (!seller)
            throw new common_1.NotFoundException("Seller not found");
        const subcategory = await this.subcategoriesService.findOne(subcategoryId);
        if (!subcategory)
            throw new common_1.NotFoundException("Subcategory not found");
        const product = this.productsRepo.create({
            ...rest,
            seller,
            subcategory
        });
        return this.productsRepo.save(product);
    }
    findAll() {
        return this.productsRepo.find({ relations: ["seller", "subcategory"] });
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne({
            where: { id },
            relations: ["seller", "subcategory"]
        });
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        Object.assign(product, updateProductDto);
        return this.productsRepo.save(product);
    }
    async remove(id) {
        const result = await this.productsRepo.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException("Product not found");
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sellers_service_1.SellersService,
        subcategories_service_1.SubcategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map