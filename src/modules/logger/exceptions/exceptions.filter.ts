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

    // this.logger.error({ message, payload: exception.stack, url: request.url });

    this.logger.error({
      message,
      status,
      path: request.url,
      method: request.method,
      correlationId: request.headers["x-correlation-id"],
      stack: exception instanceof Error ? exception.stack : null
    });

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId: response.getHeader("x-correlation-id")
    });
  }
}
