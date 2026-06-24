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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const seller_entity_1 = require("./seller.entity");
const subcategory_entity_1 = require("./subcategory.entity");
const swagger_1 = require("@nestjs/swagger");
const review_entity_1 = require("./review.entity");
let Product = class Product {
    id;
    seller;
    sellerId;
    subcategory;
    subcategoryId;
    name;
    description;
    price;
    stock;
    imageUrl;
    reviews;
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique identifier", format: "uuid" }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seller_entity_1.Seller, seller => seller.products),
    (0, typeorm_1.JoinColumn)({ name: "sellerId" }),
    __metadata("design:type", seller_entity_1.Seller)
], Product.prototype, "seller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Seller ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.Subcategory, subcategory => subcategory.products, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "subcategoryId" }),
    __metadata("design:type", subcategory_entity_1.Subcategory)
], Product.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Subcategory ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "subcategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Product title" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Product description" }),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Product price", type: "number" }),
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Product stock quantity", type: "number" }),
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Product image URL", required: false }),
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, review => review.product),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
//# sourceMappingURL=product.entity.js.map