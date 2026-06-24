"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpStore = void 0;
const crypto = __importStar(require("crypto"));
class OtpStore {
    data = new Map();
    hash(code) { return crypto.createHash('sha256').update(code).digest('hex'); }
    set(identifier, code, ttlSec = 300) {
        const day = new Date().toISOString().slice(0, 10);
        const rec = this.data.get(identifier);
        const base = rec ?? { hash: '', expiresAt: 0, resendAt: 0, attempts: 0, sentToday: 0, day };
        if (base.day !== day) {
            base.sentToday = 0;
            base.day = day;
        }
        base.hash = this.hash(code);
        base.expiresAt = Date.now() + ttlSec * 1000;
        base.resendAt = Date.now() + 60 * 1000;
        base.attempts = 0;
        base.sentToday += 1;
        this.data.set(identifier, base);
    }
    canSend(identifier) {
        const rec = this.data.get(identifier);
        const day = new Date().toISOString().slice(0, 10);
        if (!rec)
            return { ok: true };
        const limitPerDay = 5;
        if (rec.day !== day)
            return { ok: true };
        if (Date.now() < rec.resendAt)
            return { ok: false, reason: 'Wait before resend' };
        if (rec.sentToday >= limitPerDay)
            return { ok: false, reason: 'Daily limit' };
        return { ok: true };
    }
    verify(identifier, code) {
        const rec = this.data.get(identifier);
        if (!rec)
            return { ok: false, reason: 'No code' };
        if (Date.now() > rec.expiresAt)
            return { ok: false, reason: 'Expired' };
        rec.attempts += 1;
        if (rec.attempts > 5)
            return { ok: false, reason: 'Too many attempts' };
        const match = rec.hash === this.hash(code);
        if (match)
            this.data.delete(identifier);
        return { ok: match, reason: match ? undefined : 'Wrong code' };
    }
}
exports.OtpStore = OtpStore;
//# sourceMappingURL=otp.store.js.map