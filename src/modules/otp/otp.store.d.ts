export declare class OtpStore {
    private data;
    private hash;
    set(identifier: string, code: string, ttlSec?: number): void;
    canSend(identifier: string): {
        ok: boolean;
        reason?: undefined;
    } | {
        ok: boolean;
        reason: string;
    };
    verify(identifier: string, code: string): {
        ok: boolean;
        reason: string | undefined;
    };
}
