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
exports.CreateSellerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSellerDto {
    userId;
    shopName;
    legalAddress;
    taxId;
    phone;
    description;
}
exports.CreateSellerDto = CreateSellerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User id (owner of the shop)", format: "uuid" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Shop name" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Legal address", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "legalAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Tax identifier", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Phone number", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Description", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "description", void 0);
//# sourceMappingURL=create-seller.dto.js.map