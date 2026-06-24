"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioSmsProvider = void 0;
const twilio_1 = require("twilio");
class TwilioSmsProvider {
    client = new twilio_1.Twilio("" + process.env.TWILIO_SID, "" + process.env.TWILIO_TOKEN);
    from = process.env.TWILIO_FROM;
    async sendOtp(phone, code) {
        await this.client.messages.create({
            from: this.from,
            to: phone,
            body: `Your verification code: ${code}`
        });
    }
}
exports.TwilioSmsProvider = TwilioSmsProvider;
//# sourceMappingURL=twilio.provider.js.map