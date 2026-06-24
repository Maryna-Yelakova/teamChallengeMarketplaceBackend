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
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_otp_dto_1 = require("./dtos/send-otp.dto");
const verify_otp_dto_1 = require("./dtos/verify-otp.dto");
const send_email_otp_dto_1 = require("./dtos/send-email-otp.dto");
const verify_email_otp_dto_1 = require("./dtos/verify-email-otp.dto");
const send_otp_response_1 = require("./dtos/send-otp.response");
const verify_otp_response_1 = require("./dtos/verify-otp.response");
const otp_service_1 = require("./otp.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let OtpController = class OtpController {
    otp;
    constructor(otp) {
        this.otp = otp;
    }
    send(dto) {
        return this.otp.send(dto.phone);
    }
    async verify(dto) {
        const res = await this.otp.verify(dto.phone, dto.code);
        if (!res.ok)
            return { ok: false, reason: res.reason };
        await this.otp.markPhoneAsValidated(dto.phone);
        return { ok: true };
    }
    sendEmail(dto) {
        return this.otp.sendEmail(dto.email);
    }
    async verifyEmail(dto) {
        const res = await this.otp.verifyEmail(dto.email, dto.code);
        if (!res.ok)
            return { ok: false, reason: res.reason };
        await this.otp.markEmailAsValidated(dto.email);
        return { ok: true, reason: res.reason };
    }
};
exports.OtpController = OtpController;
__decorate([
    (0, common_1.Post)("phone/send"),
    (0, swagger_1.ApiOperation)({ summary: "Надіслати OTP на телефон", operationId: "sendPhoneOtp" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiProduces)("application/json"),
    (0, swagger_1.ApiBody)({ type: send_otp_dto_1.SendOtpDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "OTP успішно відправлено",
        content: {
            "application/json": {
                schema: { $ref: (0, swagger_1.getSchemaPath)(send_otp_response_1.SendOtpResponseDto) },
                examples: {
                    dev: { value: { ok: true, devHint: "000000" } },
                    prod: { value: { ok: true, message: "OTP sent to +380931234567" } }
                }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Некоректний телефон або інша помилка запиту",
        content: {
            "application/json": {
                examples: {
                    badPhone: {
                        value: {
                            statusCode: 400,
                            message: "Phone must be in international format",
                            error: "Bad Request"
                        }
                    },
                    limit: {
                        value: {
                            statusCode: 400,
                            message: "Too many requests, try later",
                            error: "Bad Request"
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiTooManyRequestsResponse)({
        description: "Rate limit перевищено",
        content: {
            "application/json": {
                example: { statusCode: 429, message: "Too many requests", error: "Too Many Requests" }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "send", null);
__decorate([
    (0, common_1.Post)("phone/verify"),
    (0, swagger_1.ApiOperation)({ summary: "Перевірити OTP код", operationId: "verifyPhoneOtp" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiProduces)("application/json"),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({
        description: "Результат перевірки OTP",
        content: {
            "application/json": {
                schema: { $ref: (0, swagger_1.getSchemaPath)(verify_otp_response_1.VerifyOtpResponseDto) },
                examples: {
                    success: { value: { ok: true } },
                    alreadyVerified: { value: { ok: false, reason: "Phone already verified" } },
                    invalid: { value: { ok: false, reason: "Invalid code" } },
                    notFound: { value: { ok: false, reason: "Phone not found" } },
                    expired: { value: { ok: false, reason: "Code not found (expired or not requested)" } }
                }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Помилка валідації (DTO) або бізнес-логіки",
        content: {
            "application/json": {
                examples: {
                    badPhone: {
                        value: {
                            statusCode: 400,
                            message: "Phone must be in international format",
                            error: "Bad Request"
                        }
                    },
                    badCode: {
                        value: { statusCode: 400, message: ["code must be 6 characters"], error: "Bad Request" }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)("email/send"),
    (0, swagger_1.ApiOperation)({ summary: "Send OTP to email", operationId: "sendEmailOtp" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiProduces)("application/json"),
    (0, swagger_1.ApiBody)({ type: send_email_otp_dto_1.SendEmailOtpDto }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, swagger_1.ApiCreatedResponse)({
        description: "OTP successfully sent to email",
        content: {
            "application/json": {
                schema: { $ref: (0, swagger_1.getSchemaPath)(send_otp_response_1.SendOtpResponseDto) },
                examples: {
                    dev: { value: { ok: true, devHint: "000000" } },
                    prod: { value: { ok: true, message: "OTP sent to user@example.com" } }
                }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid email or other request error",
        content: {
            "application/json": {
                examples: {
                    badEmail: {
                        value: {
                            statusCode: 400,
                            message: "Must be a valid email address",
                            error: "Bad Request"
                        }
                    },
                    limit: {
                        value: {
                            statusCode: 400,
                            message: "Too many requests, try later",
                            error: "Bad Request"
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_email_otp_dto_1.SendEmailOtpDto]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)("email/verify"),
    (0, swagger_1.ApiOperation)({ summary: "Verify OTP code for email", operationId: "verifyEmailOtp" }),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiProduces)("application/json"),
    (0, swagger_1.ApiBody)({ type: verify_email_otp_dto_1.VerifyEmailOtpDto }),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({
        description: "Email OTP verification result",
        content: {
            "application/json": {
                schema: { $ref: (0, swagger_1.getSchemaPath)(verify_otp_response_1.VerifyOtpResponseDto) },
                examples: {
                    success: { value: { ok: true } },
                    alreadyVerified: { value: { ok: false, reason: "Email already verified" } },
                    invalid: { value: { ok: false, reason: "Invalid code" } },
                    expired: { value: { ok: false, reason: "Code not found (expired or not requested)" } }
                }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Validation error (DTO) or business logic error",
        content: {
            "application/json": {
                examples: {
                    badEmail: {
                        value: {
                            statusCode: 400,
                            message: "Must be a valid email address",
                            error: "Bad Request"
                        }
                    },
                    badCode: {
                        value: { statusCode: 400, message: ["code must be 6 characters"], error: "Bad Request" }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_otp_dto_1.VerifyEmailOtpDto]),
    __metadata("design:returntype", Promise)
], OtpController.prototype, "verifyEmail", null);
exports.OtpController = OtpController = __decorate([
    (0, swagger_1.ApiTags)("Otp"),
    (0, common_1.Controller)("otp"),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [otp_service_1.OtpService])
], OtpController);
//# sourceMappingURL=otp.controller.js.map