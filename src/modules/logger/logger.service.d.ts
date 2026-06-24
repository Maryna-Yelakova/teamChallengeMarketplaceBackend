export declare class LoggerService {
    private readonly logger;
    constructor();
    private withContext;
    log(message: unknown): void;
    info(payload: Record<string, unknown>): void;
    error(payload: Record<string, unknown>): void;
    fatal(message: unknown): void;
    warn(payload: Record<string, unknown>): void;
    debug(payload: Record<string, unknown>): void;
    verbose(message: unknown): void;
    withService(context: string): {
        info: (payload: Record<string, unknown>) => void;
        error: (payload: Record<string, unknown>) => void;
        warn: (payload: Record<string, unknown>) => void;
        debug: (payload: Record<string, unknown>) => void;
    };
}
