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
exports.Seller = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
const product_entity_1 = require("./product.entity");
const review_entity_1 = require("./review.entity");
let Seller = class Seller {
    id;
    user;
    userId;
    shopName;
    legalAddress;
    taxId;
    phone;
    description;
    createdAt;
    products;
    reviews;
};
exports.Seller = Seller;
__decorate([
    (0, swagger_1.ApiProperty)({ format: "uuid", description: "Unique identifier for the seller" }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Seller.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.sellers, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], Seller.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID of the seller",
        format: "uuid",
        example: "181fe998-8066-41e1-989b-71cd9a085a55"
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Name of the shop", example: "My Amazing Shop" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Legal address of the seller",
        example: "123 Main St, Kiev, Ukraine"
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "legalAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Tax identification number",
        example: "12345678901"
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Phone number", example: "+380991234567" }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Description of the seller's business",
        example: "We sell quality products"
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Seller.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date when seller was created" }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Seller.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, product => product.seller),
    __metadata("design:type", Array)
], Seller.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, review => review.seller),
    __metadata("design:type", Array)
], Seller.prototype, "reviews", void 0);
exports.Seller = Seller = __decorate([
    (0, typeorm_1.Entity)("sellers")
], Seller);
//# sourceMappingURL=seller.entity.js.map