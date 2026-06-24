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
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_service_1 = require("../logger.service");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    baseLogger;
    logger;
    constructor(baseLogger) {
        this.baseLogger = baseLogger;
        this.logger = this.baseLogger.withService(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, query } = req;
        const start = Date.now();
        this.logger.info({
            message: "HTTP Request",
            method,
            url,
            body,
            query
        });
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                const duration = Date.now() - start;
                this.logger.info({
                    message: "HTTP Response",
                    method,
                    url,
                    duration
                });
            }
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map