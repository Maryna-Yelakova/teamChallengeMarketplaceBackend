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
exports.Subcategory = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const product_entity_1 = require("./product.entity");
const swagger_1 = require("@nestjs/swagger");
let Subcategory = class Subcategory {
    id;
    name;
    category;
    categoryId;
    parentSubcategory;
    parentSubcategoryId;
    children;
    products;
};
exports.Subcategory = Subcategory;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique identifier", format: "uuid" }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Subcategory.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Subcategory name" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subcategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, category => category.subcategories, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", category_entity_1.Category)
], Subcategory.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Category ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subcategory.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subcategory, subcategory => subcategory.children, {
        nullable: true,
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "parentSubcategoryId" }),
    __metadata("design:type", Subcategory)
], Subcategory.prototype, "parentSubcategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Parent subcategory ID", format: "uuid", required: false, example: "181fe998-8066-41e1-989b-71cd9a085a55" }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subcategory.prototype, "parentSubcategoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subcategory, subcategory => subcategory.parentSubcategory),
    __metadata("design:type", Array)
], Subcategory.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, product => product.subcategory),
    __metadata("design:type", Array)
], Subcategory.prototype, "products", void 0);
exports.Subcategory = Subcategory = __decorate([
    (0, typeorm_1.Entity)("subcategories")
], Subcategory);
//# sourceMappingURL=subcategory.entity.js.map