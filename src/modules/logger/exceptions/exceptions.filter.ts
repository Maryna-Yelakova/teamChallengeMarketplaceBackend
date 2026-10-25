import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { LoggerService } from "../logger.service";
import { Request, Response } from "express";
import { ContextLogger } from "../types/logger.types";
// import { Logger } from "nestjs-pino";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: ContextLogger;

  constructor(private readonly baseLogger: LoggerService) {
    this.logger = this.baseLogger.withService(AllExceptionsFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message;
    const exceptionBody = exception instanceof HttpException ? exception.getResponse() : null;
    const details =
      typeof exceptionBody === "object" && exceptionBody !== null
        ? (exceptionBody as Record<string, unknown>)
        : null;

    // request.path excludes query values that may contain tokens or other secrets.
    this.logger.error({
      message,
      status,
      path: request.path,
      method: request.method,
      correlationId: request.headers["x-correlation-id"],
      stack: exception instanceof Error ? exception.stack : null
    });

    response.status(status).json({
      statusCode: status,
      message,
      // Preserve field-level registration conflicts so mobile stays on the editable form.
      ...(typeof details?.code === "string" ? { code: details.code } : {}),
      ...(details?.fieldErrors && typeof details.fieldErrors === "object"
        ? { fieldErrors: details.fieldErrors }
        : {}),
      path: request.path,
      timestamp: new Date().toISOString(),
      correlationId: response.getHeader("x-correlation-id")
    });
  }
}
