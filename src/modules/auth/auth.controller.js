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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dtos/create-user.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
const login_user_dto_1 = require("../users/dtos/login-user.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const check_policies_decorator_1 = require("../casl/decorators/check-policies.decorator");
const casl_ability_types_1 = require("../casl/casl-ability.types");
const user_entity_1 = require("../../entities/user.entity");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(res, createUserDto) {
        return this.authService.register(res, createUserDto);
    }
    login(res, loginUserDto) {
        const { identifier, password } = loginUserDto;
        return this.authService.login(res, identifier, password);
    }
    logout(res) {
        return this.authService.logout(res);
    }
    refresh(req, res) {
        return this.authService.refresh(req.user.userId, res);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Register new user" }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "User successfully registered",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" },
                firstName: { type: "string", example: "Василь" },
                email: { type: "string", example: "basilbasilyuk@mail.gov" },
                phone: { type: "string", example: "+380991234567" },
                isSeller: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Validation error or user already exists",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 400 },
                message: {
                    oneOf: [
                        { type: "string", example: "User with this email already exists" },
                        {
                            type: "array",
                            items: { type: "string" },
                            example: [
                                "email must be an email",
                                "password must be longer than or equal to 6 characters"
                            ]
                        }
                    ]
                },
                error: { type: "string", example: "Bad Request" }
            }
        }
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Login existing user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "User successfully logged in",
        schema: {
            type: "object",
            properties: {
                isPhoneValidated: { type: "boolean", example: false },
                isEmailValidated: { type: "boolean", example: false },
                accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials or unverified phone/email",
        content: {
            "application/json": {
                examples: {
                    invalidCredentials: {
                        summary: "Invalid credentials",
                        value: { statusCode: 401, message: "Invalid credentials", error: "Unauthorized" }
                    },
                    phoneNotVerified: {
                        summary: "Phone not verified",
                        value: {
                            statusCode: 401,
                            message: "Please verify your phone number first",
                            error: "Unauthorized"
                        }
                    },
                    emailNotVerified: {
                        summary: "Email not verified",
                        value: {
                            statusCode: 401,
                            message: "Please verify your email first",
                            error: "Unauthorized"
                        }
                    }
                }
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
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Logout user" }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Refresh user's credentions when access token expired" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Tokens successfully refreshed",
        schema: {
            type: "object",
            properties: {
                accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
            }
        }
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid refresh token",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Invalid refresh token" },
                error: { type: "string", example: "Unauthorized" }
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshGuard),
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, check_policies_decorator_1.CheckPolicies)((ability) => ability.can(casl_ability_types_1.Action.Read, user_entity_1.User)),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map