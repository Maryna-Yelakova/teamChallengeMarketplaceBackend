"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPinoLogger = void 0;
class TypeOrmPinoLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    logQuery(query, parameters, queryRunner) {
        this.logger.debug({
            context: "TypeORM",
            message: "SQL Query",
            query,
            parameters,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        });
    }
    logQueryError(error, query, parameters, queryRunner) {
        this.logger.error({
            context: "TypeORM",
            message: "SQL Error",
            error,
            query,
            parameters,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        });
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        this.logger.warn({
            context: "TypeORM",
            message: "Slow Query",
            duration: time,
            query,
            parameters,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        });
    }
    logSchemaBuild(message, queryRunner) {
        this.logger.info({
            context: "TypeORM",
            message: "Schema build",
            details: message,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        });
    }
    logMigration(message, queryRunner) {
        this.logger.info({
            context: "TypeORM",
            message: "Migration",
            details: message,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        });
    }
    log(level, message, queryRunner) {
        const logInfo = {
            context: "TypeORM",
            message,
            queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
        };
        if (level === "log" || level === "info") {
            this.logger.info(logInfo);
        }
        else {
            this.logger.warn(logInfo);
        }
    }
}
exports.TypeOrmPinoLogger = TypeOrmPinoLogger;
//# sourceMappingURL=typeorm.logger.js.map