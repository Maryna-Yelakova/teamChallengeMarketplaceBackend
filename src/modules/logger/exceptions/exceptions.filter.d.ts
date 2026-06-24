import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { LoggerService } from "../logger.service";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly baseLogger;
    private readonly logger;
    constructor(baseLogger: LoggerService);
    catch(exception: Error, host: ArgumentsHost): void;
}
