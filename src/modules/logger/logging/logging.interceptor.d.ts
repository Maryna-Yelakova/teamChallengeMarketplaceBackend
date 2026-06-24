import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { LoggerService } from "../logger.service";
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly baseLogger;
    private readonly logger;
    constructor(baseLogger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
