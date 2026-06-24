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
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger.service");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    baseLogger;
    logger;
    constructor(baseLogger) {
        this.baseLogger = baseLogger;
        this.logger = this.baseLogger.withService(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        const message = exception.message;
        this.logger.error({
            message,
            status,
            path: request.url,
            method: request.method,
            correlationId: request.headers["x-correlation-id"],
            stack: exception instanceof Error ? exception.stack : null
        });
        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            correlationId: response.getHeader("x-correlation-id")
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], AllExceptionsFilter);
//# sourceMappingURL=exceptions.filter.js.map