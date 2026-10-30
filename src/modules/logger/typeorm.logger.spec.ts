import type { Logger as TypeOrmLogger } from "typeorm";
import type { LoggerService } from "./logger.service";
import { TypeOrmPinoLogger } from "./typeorm.logger";

describe("TypeOrmPinoLogger", () => {
  it("keeps SQL, parameters, and driver messages out of every log event", () => {
    const output = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    const logger: TypeOrmLogger = new TypeOrmPinoLogger(output as unknown as LoggerService);
    const secret = "sensitive-value-123";

    logger.logQuery(`SELECT '${secret}'`, [secret]);
    logger.logQueryError(new Error(`Failed for ${secret}`), `SELECT '${secret}'`, [secret]);
    logger.logQuerySlow(250, `SELECT '${secret}'`, [secret]);
    logger.logSchemaBuild(`Schema contains ${secret}`);
    logger.logMigration(`Migration contains ${secret}`);
    logger.log("info", `Info contains ${secret}`);
    logger.log("warn", `Warning contains ${secret}`);

    expect(output.error).toHaveBeenCalledWith({
      context: "TypeORM",
      message: "SQL query failed"
    });
    expect(output.warn).toHaveBeenCalledWith({
      context: "TypeORM",
      message: "Slow SQL query",
      durationMs: 250
    });
    expect(
      JSON.stringify({
        info: output.info.mock.calls,
        warn: output.warn.mock.calls,
        error: output.error.mock.calls
      })
    ).not.toContain(secret);
  });
});
