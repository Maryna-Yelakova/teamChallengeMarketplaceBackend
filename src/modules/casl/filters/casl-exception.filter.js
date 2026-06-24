"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const ability_1 = require("@casl/ability");
let CaslExceptionFilter = class CaslExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        response.status(common_1.HttpStatus.FORBIDDEN).json({
            statusCode: common_1.HttpStatus.FORBIDDEN,
            message: `Access denied, reason: ${exception.message}`,
            error: "Forbidden"
        });
    }
};
exports.CaslExceptionFilter = CaslExceptionFilter;
exports.CaslExceptionFilter = CaslExceptionFilter = __decorate([
    (0, common_1.Catch)(ability_1.ForbiddenError)
], CaslExceptionFilter);
//# sourceMappingURL=casl-exception.filter.js.map