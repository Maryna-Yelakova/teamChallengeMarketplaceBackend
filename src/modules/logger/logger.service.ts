import { Injectable } from "@nestjs/common";
import pino, { Logger } from "pino";
import { getCorrelationId } from "src/context/request-context";

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    const isProd = process.env.NODE_ENV === "production";

    this.logger = pino({
      level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),

      transport: {
        targets: [
          {
            target: "pino-rotating-file-stream",
            options: {
              path: "./logs",
              filename: "app.log",
              interval: "1d", // щодня
              size: "10M", // або по розміру
              maxFiles: 7, // 🔥 максимум 7 файлів
              compress: true
            }
          },
          {
            target: "pino-rotating-file-stream",
            level: "error",
            options: {
              path: "./logs",
              filename: "error.log",
              interval: "1d", // щодня
              size: "10M", // або по розміру
              maxFiles: 7, // 🔥 максимум 7 файлів
              compress: true
            }
          },
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname"
            }
          }
        ]
      },

      base: undefined, // не додаємо pid/hostname
      timestamp: pino.stdTimeFunctions.isoTime
    });
  }

  private withContext(payload: Record<string, unknown>) {
    const result =
      typeof payload === "object" && payload !== null ? payload : { message: String(payload) };
    return {
      ...result,
      correlationId: getCorrelationId()
    };
  }

  log(message: unknown) {
    this.logger.info(this.withContext({ message }));
  }

  info(payload: Record<string, unknown>) {
    this.logger.info(this.withContext(payload));
  }

  error(payload: Record<string, unknown>) {
    this.logger.error(this.withContext(payload));
  }

  fatal(message: unknown) {
    this.logger.fatal(this.withContext({ message }));
  }

  warn(payload: Record<string, unknown>) {
    this.logger.warn(this.withContext(payload));
  }

  debug(payload: Record<string, unknown>) {
    this.logger.debug(this.withContext(payload));
  }

  verbose(message: unknown) {
    this.logger.debug(this.withContext({ message }));
  }

  withService(context: string) {
    const child = this.logger.child({ context });

    return {
      info: (payload: Record<string, unknown>) => child.info(this.withContext(payload)),

      error: (payload: Record<string, unknown>) => child.error(this.withContext(payload)),

      warn: (payload: Record<string, unknown>) => child.warn(this.withContext(payload)),

      debug: (payload: Record<string, unknown>) => child.debug(this.withContext(payload))
    };
  }
}
