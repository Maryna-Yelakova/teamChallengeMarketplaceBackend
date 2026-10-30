import { Logger as TypeOrmLogger } from "typeorm";
import { LoggerService } from "./logger.service";

/** Avoids recording SQL and bound values, which may contain private data. */
export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly logger: LoggerService) {}

  logQuery(): void {
    // TypeORM calls this for every query; routine statements are intentionally skipped.
  }

  logQueryError(): void {
    // A fixed message avoids copying SQL or driver error text into logs.
    this.logger.error({
      context: "TypeORM",
      message: "SQL query failed"
    });
  }

  logQuerySlow(time: number): void {
    // Duration is useful for diagnosis without exposing the query or its values.
    this.logger.warn({
      context: "TypeORM",
      message: "Slow SQL query",
      durationMs: time
    });
  }

  logSchemaBuild(): void {
    // Schema messages can contain raw SQL; record only the event.
    this.logger.info({
      context: "TypeORM",
      message: "Schema build event"
    });
  }

  logMigration(): void {
    // Migration details may include SQL or values; omit the supplied text.
    this.logger.info({
      context: "TypeORM",
      message: "Migration event"
    });
  }

  log(level: "log" | "info" | "warn"): void {
    // Preserve the severity without forwarding TypeORM's free-form message.
    if (level === "warn") {
      this.logger.warn({ context: "TypeORM", message: "TypeORM warning" });
      return;
    }

    this.logger.info({ context: "TypeORM", message: "TypeORM event" });
  }
}
