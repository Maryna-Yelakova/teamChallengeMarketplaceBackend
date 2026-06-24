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
exports.JwtRefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const passport_jwt_1 = require("passport-jwt");
const utils_1 = require("../../../common/utils");
const user_entity_1 = require("../../../entities/user.entity");
const typeorm_2 = require("typeorm");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "refresh") {
    usersRepo;
    configService;
    constructor(usersRepo, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([utils_1.extractRefreshToken]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("JWT_SECRET")
        });
        this.usersRepo = usersRepo;
        this.configService = configService;
    }
    async validate(payload) {
        if (!payload.userId) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        const user = await this.usersRepo.findOneBy({ id: payload.userId });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found for the provided refresh token");
        }
        return { userId: payload.userId, identityWay: payload.identityWay };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt-refresh.strategy.js.map