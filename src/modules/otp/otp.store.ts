
import * as crypto from 'crypto';

type Rec = { hash: string; expiresAt: number; resendAt: number; attempts: number; sentToday: number; day: string; };
export class OtpStore {
  private data = new Map<string, Rec>();
  private hash(code: string) { return crypto.createHash('sha256').update(code).digest('hex'); }

  set(phone: string, code: string, ttlSec = 300) {
    const day = new Date().toISOString().slice(0,10);
    const rec = this.data.get(phone);
    const base: Rec = rec ?? { hash:'', expiresAt:0, resendAt:0, attempts:0, sentToday:0, day };
    if (base.day !== day) { base.sentToday = 0; base.day = day; }
    base.hash = this.hash(code);
    base.expiresAt = Date.now() + ttlSec*1000;
    base.resendAt = Date.now() + 60*1000; // антиспам: 60с між повторними відправками
    base.attempts = 0;
    base.sentToday += 1;
    this.data.set(phone, base);
  }

  canSend(phone: string) {
    const rec = this.data.get(phone);
    const day = new Date().toISOString().slice(0,10);
    if (!rec) return { ok: true };
    const limitPerDay = 5;
    if (rec.day !== day) return { ok: true };
    if (Date.now() < rec.resendAt) return { ok: false, reason: 'Wait before resend' };
    if (rec.sentToday >= limitPerDay) return { ok: false, reason: 'Daily limit' };
    return { ok: true };
  }

  verify(phone: string, code: string) {
    const rec = this.data.get(phone);
    if (!rec) return { ok: false, reason: 'No code' };
    if (Date.now() > rec.expiresAt) return { ok: false, reason: 'Expired' };
    rec.attempts += 1;
    if (rec.attempts > 5) return { ok: false, reason: 'Too many attempts' };
    const match = rec.hash === this.hash(code);
    if (match) this.data.delete(phone);
    return { ok: match, reason: match ? undefined : 'Wrong code' };
  }
}
