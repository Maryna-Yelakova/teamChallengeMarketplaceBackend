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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dtos/update-user.dto");
const change_phone_dto_1 = require("./dtos/change-phone.dto");
const swagger_1 = require("@nestjs/swagger");
const ability_decorator_1 = require("../casl/decorators/ability.decorator");
const change_password_dto_1 = require("../auth/dtos/change-password.dto");
let UsersController = class UsersController {
    UsersService;
    constructor(UsersService) {
        this.UsersService = UsersService;
    }
    async getUserById(id, ability) {
        return await this.UsersService.findById(id, ability);
    }
    async isEmailPresent(email) {
        const user = await this.UsersService.findByEmail(email);
        return { isPresent: !!user };
    }
    async isPhonePresent(phone) {
        const user = await this.UsersService.findByPhone(phone);
        return { isPresent: !!user };
    }
    async delete(id, ability) {
        await this.UsersService.delete(id, ability);
    }
    async updateUser(id, updateUserDto, ability) {
        return await this.UsersService.update(id, updateUserDto, ability);
    }
    async changePhone(id, changePhoneDto, ability) {
        const updatedUser = await this.UsersService.changePhone(id, changePhoneDto.newPhone, ability);
        const { password, ...result } = updatedUser;
        return result;
    }
    changePassword(req, dto, ability) {
        return this.UsersService.changePassword(req.user.userId, dto, ability);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get user by ID" }),
    (0, swagger_1.ApiOkResponse)({
        description: "User found successfully",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
                firstName: { type: "string", example: "Василь" },
                email: { type: "string", example: "basilbasilyuk@mail.gov" },
                phone: { type: "string", example: "+380991234567" },
                isPhoneValidated: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 404 },
                message: { type: "string", example: "User not found" },
                error: { type: "string", example: "Not Found" }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "User not authenticated",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The unique user's ID",
        type: String,
        example: "181fe998-8066-41e1-989b-71cd9a085a55"
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, ability_decorator_1.Ability)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)("iep"),
    (0, swagger_1.ApiOperation)({ summary: "Is email present?" }),
    (0, swagger_1.ApiParam)({
        name: "email",
        description: "The user's email",
        type: String,
        example: "myemail@mail.com"
    }),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "isEmailPresent", null);
__decorate([
    (0, common_1.Get)("ipp"),
    (0, swagger_1.ApiOperation)({ summary: "Is phone present?" }),
    (0, swagger_1.ApiParam)({
        name: "phone",
        description: "The user's phone number",
        type: String,
        example: "+380501234567"
    }),
    __param(0, (0, common_1.Param)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "isPhonePresent", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "User deleted successfully",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "User deleted successfully" }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 404 },
                message: { type: "string", example: "User not found" },
                error: { type: "string", example: "Not Found" }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "User not authenticated",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The unique user's ID",
        type: String,
        example: "181fe998-8066-41e1-989b-71cd9a085a55"
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, ability_decorator_1.Ability)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a specific user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "User updated successfully",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
                firstName: { type: "string", example: "Василь" },
                email: { type: "string", example: "basilbasilyuk@mail.gov" },
                phone: { type: "string", example: "+380991234567" },
                isPhoneValidated: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 404 },
                message: { type: "string", example: "User not found" },
                error: { type: "string", example: "Not Found" }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Validation error",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 400 },
                message: { type: "array", items: { type: "string" }, example: ["email must be an email"] },
                error: { type: "string", example: "Bad Request" }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "User not authenticated",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The unique user's ID",
        type: String,
        example: "181fe998-8066-41e1-989b-71cd9a085a55"
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, ability_decorator_1.Ability)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUsersDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)(":id/change-phone"),
    (0, swagger_1.ApiOperation)({ summary: "Change user's phone number" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Phone number changed successfully",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
                firstName: { type: "string", example: "Василь" },
                email: { type: "string", example: "basilbasilyuk@mail.gov" },
                phone: { type: "string", example: "+380501234567" },
                isPhoneValidated: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 404 },
                message: { type: "string", example: "User not found" },
                error: { type: "string", example: "Not Found" }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Validation error",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 400 },
                message: {
                    type: "array",
                    items: { type: "string" },
                    example: ["newPhone must be in international format"]
                },
                error: { type: "string", example: "Bad Request" }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "User not authenticated",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "The unique user's ID",
        type: String,
        example: "181fe998-8066-41e1-989b-71cd9a085a55"
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, ability_decorator_1.Ability)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_phone_dto_1.ChangePhoneDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePhone", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Change user password" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                currentPassword: { type: "string", example: "oldpassword" },
                newPassword: { type: "string", example: "newpassword" }
            }
        }
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Password successfully changed",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Password changed successfully" }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid current password or validation error",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 400 },
                message: {
                    oneOf: [
                        { type: "string", example: "Current password is incorrect" },
                        {
                            type: "array",
                            items: { type: "string" },
                            example: ["newPassword must be longer than or equal to 6 characters"]
                        }
                    ]
                },
                error: { type: "string", example: "Bad Request" }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "User not authenticated",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Patch)("change-password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, ability_decorator_1.Ability)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map