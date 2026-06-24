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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const casl_ability_types_1 = require("../casl/casl-ability.types");
const ability_1 = require("@casl/ability");
const bcrypt = __importStar(require("bcrypt"));
const logger_service_1 = require("../logger/logger.service");
let UsersService = UsersService_1 = class UsersService {
    usersRepo;
    baseLogger;
    logger;
    constructor(usersRepo, baseLogger) {
        this.usersRepo = usersRepo;
        this.baseLogger = baseLogger;
        this.logger = this.baseLogger.withService(UsersService_1.name);
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepo.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new common_2.BadRequestException("User with this email already exists");
        }
        const user = this.usersRepo.create(createUserDto);
        this.logger.debug({
            message: "User created",
            userId: user.id
        });
        return await this.usersRepo.save(user);
    }
    findByEmail(email) {
        return this.usersRepo.findOne({ where: { email } });
    }
    findByPhone(phone) {
        return this.usersRepo.findOne({ where: { phone } });
    }
    async findById(id, ability) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        ability_1.ForbiddenError.from(ability).throwUnlessCan(casl_ability_types_1.Action.Read, user);
        const { password, ...result } = user;
        return result;
    }
    async update(id, updateUserDto, ability) {
        const user = await this.findById(id, ability);
        Object.assign(user, updateUserDto);
        return await this.usersRepo.save(user);
    }
    async markPhoneAsValidated(phone) {
        const user = await this.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        user.isPhoneValidated = true;
        return await this.usersRepo.save(user);
    }
    async markEmailAsValidated(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        user.isEmailValidated = true;
        return await this.usersRepo.save(user);
    }
    async delete(id, ability) {
        const user = await this.findById(id, ability);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await this.usersRepo.delete({ id });
    }
    async changePhone(id, newPhone, ability) {
        const user = await this.findById(id, ability);
        const existingUser = await this.usersRepo.findOne({ where: { phone: newPhone } });
        if (existingUser && existingUser.id !== id) {
            throw new common_2.BadRequestException("Phone number is already in use");
        }
        user.phone = newPhone;
        user.isPhoneValidated = false;
        return await this.usersRepo.save(user);
    }
    async changePassword(userId, dto, ability) {
        if (dto.currentPassword === dto.newPassword) {
            throw new common_2.BadRequestException("New password must be different from current password");
        }
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        ability_1.ForbiddenError.from(ability).throwUnlessCan(casl_ability_types_1.Action.Update, user);
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_2.BadRequestException("Current password is incorrect");
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepo.save(user);
        return { message: "Password changed successfully" };
    }
    async deleteUnverifiedUsers() {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        await this.usersRepo.delete({
            createdAt: (0, typeorm_2.LessThan)(twoDaysAgo),
            isEmailValidated: false,
            isPhoneValidated: false
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_service_1.LoggerService])
], UsersService);
//# sourceMappingURL=users.service.js.map