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
exports.SellersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seller_entity_1 = require("../../entities/seller.entity");
const typeorm_2 = require("typeorm");
let SellersService = class SellersService {
    sellersRepo;
    constructor(sellersRepo) {
        this.sellersRepo = sellersRepo;
    }
    async create(createSellerDto) {
        const existingSeller = await this.sellersRepo.findOne({
            where: { shopName: createSellerDto.shopName, userId: createSellerDto.userId }
        });
        if (existingSeller) {
            throw new common_1.BadRequestException("Seller with this shop name already exists for the user");
        }
        const seller = this.sellersRepo.create(createSellerDto);
        return await this.sellersRepo.save(seller);
    }
    findOne(id) {
        return this.sellersRepo.findOne({ where: { id }, relations: ["user", "products"] });
    }
    update(id, updateSellerDto) {
        return `This action updates a #${id} seller with data: ${JSON.stringify(updateSellerDto)}`;
    }
    remove(id) {
        return `This action removes a #${id} seller`;
    }
};
exports.SellersService = SellersService;
exports.SellersService = SellersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seller_entity_1.Seller)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SellersService);
//# sourceMappingURL=sellers.service.js.map