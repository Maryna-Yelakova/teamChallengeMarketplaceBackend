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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const sms_provider_1 = require("../sms/sms.provider");
const email_provider_1 = require("../email/email.provider");
const otp_store_1 = require("./otp.store");
const users_service_1 = require("../users/users.service");
let OtpService = class OtpService {
    sms;
    email;
    store;
    usersService;
    constructor(sms, email, store, usersService) {
        this.sms = sms;
        this.email = email;
        this.store = store;
        this.usersService = usersService;
    }
    genCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async send(phone) {
        const ok = this.store.canSend(phone);
        if (!ok.ok) {
            throw new common_1.BadRequestException(ok.reason);
        }
        const code = process.env.NODE_ENV === "development" ? "000000" : this.genCode();
        this.store.set(phone, code);
        await this.sms.sendOtp(phone, code);
        return {
            ok: true,
            devHint: process.env.NODE_ENV === "development" ? code : undefined
        };
    }
    async verify(phone, code) {
        const user = await this.usersService.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user?.isPhoneValidated) {
            return { ok: false, reason: "Phone already verified" };
        }
        const res = this.store.verify(phone, code);
        if (!res.ok && res.reason === "No code") {
            return { ok: false, reason: "Code not found (expired or not requested)" };
        }
        return res;
    }
    async markPhoneAsValidated(phone) {
        const user = await this.usersService.findByPhone(phone);
        if (user && !user.isPhoneValidated) {
            await this.usersService.markPhoneAsValidated(phone);
        }
    }
    async sendEmail(email) {
        const ok = this.store.canSend(email);
        if (!ok.ok) {
            throw new common_1.BadRequestException(ok.reason);
        }
        const code = process.env.NODE_ENV === "development" ? "000000" : this.genCode();
        this.store.set(email, code);
        await this.email.sendOtp(email, code);
        return {
            ok: true,
            devHint: process.env.NODE_ENV === "development" ? code : undefined
        };
    }
    async verifyEmail(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user?.isEmailValidated) {
            return { ok: false, reason: "Email already verified" };
        }
        const res = this.store.verify(email, code);
        if (!res.ok && res.reason === "No code") {
            return { ok: false, reason: "Code not found (expired or not requested)" };
        }
        return res;
    }
    async markEmailAsValidated(email) {
        const user = await this.usersService.findByEmail(email);
        if (user && !user.isEmailValidated) {
            await this.usersService.markEmailAsValidated(email);
        }
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sms_provider_1.SMS_PROVIDER)),
    __param(1, (0, common_1.Inject)(email_provider_1.EMAIL_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object, otp_store_1.OtpStore,
        users_service_1.UsersService])
], OtpService);
//# sourceMappingURL=otp.service.js.map