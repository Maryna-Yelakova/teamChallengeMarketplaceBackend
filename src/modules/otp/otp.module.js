"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModule = void 0;
const common_1 = require("@nestjs/common");
const sms_provider_1 = require("../sms/sms.provider");
const twilio_provider_1 = require("../sms/twilio.provider");
const mock_provider_1 = require("../sms/mock.provider");
const email_provider_1 = require("../email/email.provider");
const mock_provider_2 = require("../email/mock.provider");
const otp_service_1 = require("./otp.service");
const otp_store_1 = require("./otp.store");
const otp_controller_1 = require("./otp.controller");
const users_module_1 = require("../users/users.module");
let OtpModule = class OtpModule {
};
exports.OtpModule = OtpModule;
exports.OtpModule = OtpModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule],
        controllers: [otp_controller_1.OtpController],
        providers: [
            otp_service_1.OtpService,
            otp_store_1.OtpStore,
            {
                provide: sms_provider_1.SMS_PROVIDER,
                useClass: process.env.NODE_ENV === 'development' ? mock_provider_1.MockSmsProvider : twilio_provider_1.TwilioSmsProvider,
            },
            {
                provide: email_provider_1.EMAIL_PROVIDER,
                useClass: mock_provider_2.MockEmailProvider,
            },
        ],
        exports: [sms_provider_1.SMS_PROVIDER, email_provider_1.EMAIL_PROVIDER, otp_service_1.OtpService],
    })
], OtpModule);
//# sourceMappingURL=otp.module.js.map