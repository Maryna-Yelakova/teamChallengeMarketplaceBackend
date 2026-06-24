"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const utils_1 = require("../../common/utils");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    JWT_ACCESS_TOKEN_TTL;
    JWT_REFRESH_TOKEN_TTL;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow("JWT_ACCESS_TOKEN_TTL");
        this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow("JWT_REFRESH_TOKEN_TTL");
    }
    async register(res, dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException("Email already in use");
        const existingPhone = await this.usersService.findByPhone(dto.phone);
        if (existingPhone)
            throw new common_1.ConflictException("Phone number already in use");
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            ...dto,
            password: hash
        });
        console.log(user);
        return { message: "User created", userId: user.id };
    }
    async login(res, identityString, password) {
        const user = await this.validateUser(identityString, password);
        if (!user)
            throw new common_1.UnauthorizedException();
        return {
            isPhoneValidated: user.isPhoneValidated,
            isEmailValidated: user.isEmailValidated,
            accessToken: this.auth(res, user.id, identityString.includes("@") ? "email" : "phone")
        };
    }
    logout(res) {
        (0, utils_1.setCookie)(res, "", new Date(0));
        return { message: "Logged out successfully" };
    }
    refresh(userId, res) {
        return { accessToken: this.auth(res, userId) };
    }
    async validateUser(identityString, pass) {
        const user = identityString.includes("@")
            ? await this.usersService.findByEmail(identityString)
            : await this.usersService.findByPhone(identityString);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("Email or password wrong");
        }
        const { password, ...result } = user;
        return result;
    }
    auth(res, id, identityWay = "email") {
        const { access_token, refresh_token } = this.generateTokens(id, identityWay);
        (0, utils_1.setCookie)(res, refresh_token, new Date(Date.now() + 1000 * 60 * 60 * 24));
        return access_token;
    }
    generateTokens(userId, identityWay) {
        const payload = { userId, identityWay };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_TOKEN_TTL }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_TOKEN_TTL })
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map