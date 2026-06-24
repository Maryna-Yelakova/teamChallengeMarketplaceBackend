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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const passport_jwt_1 = require("passport-jwt");
const casl_ability_factory_1 = require("../../casl/casl-ability.factory");
const user_entity_1 = require("../../../entities/user.entity");
const typeorm_2 = require("typeorm");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwt") {
    usersRepo;
    configService;
    caslAbilityFactory;
    constructor(usersRepo, configService, caslAbilityFactory) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.getOrThrow("JWT_SECRET")
        });
        this.usersRepo = usersRepo;
        this.configService = configService;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    async validate(payload) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            throw new common_1.UnauthorizedException("Access token has expired");
        }
        const user = await this.usersRepo.findOneBy({ id: payload.userId });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        if (user.isSeller) {
            if (!(user.isPhoneValidated && user.isEmailValidated)) {
                throw new common_1.UnauthorizedException("Please verify your email and phone number first");
            }
        }
        if (!user.isPhoneValidated && payload.identityWay === "phone") {
            throw new common_1.UnauthorizedException("Please verify your phone number first");
        }
        if (!user.isEmailValidated && payload.identityWay === "email") {
            throw new common_1.UnauthorizedException("Please verify your email first");
        }
        const ability = this.caslAbilityFactory.createForUser(user);
        return { userId: payload.userId, identityWay: payload.identityWay, ability };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        casl_ability_factory_1.CaslAbilityFactory])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map