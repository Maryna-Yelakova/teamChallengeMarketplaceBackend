import { Logger as TypeOrmLogger, QueryRunner } from "typeorm";
import { LoggerService } from "./logger.service";

export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly logger: LoggerService) {}

  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    this.logger.debug({
      context: "TypeORM",
      message: "SQL Query",
      query,
      parameters,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    });
  }

  logQueryError(error: string, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    this.logger.error({
      context: "TypeORM",
      message: "SQL Error",
      error,
      query,
      parameters,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    this.logger.warn({
      context: "TypeORM",
      message: "Slow Query",
      duration: time,
      query,
      parameters,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info({
      context: "TypeORM",
      message: "Schema build",
      details: message,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info({
      context: "TypeORM",
      message: "Migration",
      details: message,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    });
  }

  log(level: "log" | "info" | "warn", message: unknown, queryRunner?: QueryRunner) {
    const logInfo = {
      context: "TypeORM",
      message,
      queryRunner: queryRunner ? queryRunner.connection.metadataTableName : "default"
    };
    if (level === "log" || level === "info") {
      this.logger.info(logInfo);
    } else {
      this.logger.warn(logInfo);
    }
  }
}
