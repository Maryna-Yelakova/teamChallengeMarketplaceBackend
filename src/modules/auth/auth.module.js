"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./strategys/local.strategy");
const jwt_strategy_1 = require("./strategys/jwt.strategy");
const jwt_refresh_strategy_1 = require("./strategys/jwt-refresh.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const casl_module_1 = require("../casl/casl.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            users_module_1.UsersModule,
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    algorithm: "HS256"
                },
                verifyOptions: {
                    algorithms: ["HS256"],
                    ignoreExpiration: false
                }
            }),
            casl_module_1.CaslModule
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, jwt_refresh_strategy_1.JwtRefreshStrategy, jwt_auth_guard_1.JwtAuthGuard],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map