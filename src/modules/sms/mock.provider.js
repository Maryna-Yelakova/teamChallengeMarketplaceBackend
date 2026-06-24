"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSmsProvider = void 0;
class MockSmsProvider {
    async sendOtp(phone, code) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`[MOCK SMS] to ${phone}: code=${code}`);
    }
}
exports.MockSmsProvider = MockSmsProvider;
//# sourceMappingURL=mock.provider.js.map