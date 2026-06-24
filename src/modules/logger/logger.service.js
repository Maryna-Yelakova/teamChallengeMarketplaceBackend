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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const pino_1 = __importDefault(require("pino"));
const request_context_1 = require("../../context/request-context");
let LoggerService = class LoggerService {
    logger;
    constructor() {
        const isProd = process.env.NODE_ENV === "production";
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
            transport: {
                targets: [
                    {
                        target: "pino-rotating-file-stream",
                        options: {
                            path: "./logs",
                            filename: "app.log",
                            interval: "1d",
                            size: "10M",
                            maxFiles: 7,
                            compress: true
                        }
                    },
                    {
                        target: "pino-rotating-file-stream",
                        level: "error",
                        options: {
                            path: "./logs",
                            filename: "error.log",
                            interval: "1d",
                            size: "10M",
                            maxFiles: 7,
                            compress: true
                        }
                    },
                    {
                        target: "pino-pretty",
                        options: {
                            colorize: true,
                            translateTime: "SYS:standard",
                            ignore: "pid,hostname"
                        }
                    }
                ]
            },
            base: undefined,
            timestamp: pino_1.default.stdTimeFunctions.isoTime
        });
    }
    withContext(payload) {
        const result = typeof payload === "object" && payload !== null ? payload : { message: String(payload) };
        return {
            ...result,
            correlationId: (0, request_context_1.getCorrelationId)()
        };
    }
    log(message) {
        this.logger.info(this.withContext({ message }));
    }
    info(payload) {
        this.logger.info(this.withContext(payload));
    }
    error(payload) {
        this.logger.error(this.withContext(payload));
    }
    fatal(message) {
        this.logger.fatal(this.withContext({ message }));
    }
    warn(payload) {
        this.logger.warn(this.withContext(payload));
    }
    debug(payload) {
        this.logger.debug(this.withContext(payload));
    }
    verbose(message) {
        this.logger.debug(this.withContext({ message }));
    }
    withService(context) {
        const child = this.logger.child({ context });
        return {
            info: (payload) => child.info(this.withContext(payload)),
            error: (payload) => child.error(this.withContext(payload)),
            warn: (payload) => child.warn(this.withContext(payload)),
            debug: (payload) => child.debug(this.withContext(payload))
        };
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map