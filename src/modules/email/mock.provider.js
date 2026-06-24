"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockEmailProvider = void 0;
class MockEmailProvider {
    async sendOtp(email, code) {
        console.log(`[MOCK EMAIL] to ${email}: code=${code}`);
    }
}
exports.MockEmailProvider = MockEmailProvider;
//# sourceMappingURL=mock.provider.js.map