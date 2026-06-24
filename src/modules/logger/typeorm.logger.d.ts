import { Logger as TypeOrmLogger, QueryRunner } from "typeorm";
import { LoggerService } from "./logger.service";
export declare class TypeOrmPinoLogger implements TypeOrmLogger {
    private readonly logger;
    constructor(logger: LoggerService);
    logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logQueryError(error: string, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void;
    logMigration(message: string, queryRunner?: QueryRunner): void;
    log(level: "log" | "info" | "warn", message: unknown, queryRunner?: QueryRunner): void;
}
