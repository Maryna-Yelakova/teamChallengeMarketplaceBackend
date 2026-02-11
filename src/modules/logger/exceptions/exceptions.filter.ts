import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { AppLoggerService } from "../logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isDev = process.env.NODE_ENV === "development";

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, error, details } = this.extractExceptionPayload(exception);
    this.logger.error(
      `Exception: ${Array.isArray(message) ? message.join(", ") : message}`,
      exception instanceof Error ? exception.stack : undefined,
      request.url
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(isDev && details ? { details } : {}),
      ...(isDev && exception instanceof Error ? { stack: exception.stack } : {})
    });
  }

  private extractExceptionPayload(exception: unknown): {
    message: string | string[];
    error: string;
    details?: Record<string, unknown>;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "string") {
        return {
          message: response,
          error: exception.name
        };
      }

      if (response && typeof response === "object") {
        const normalized = response as Record<string, unknown>;
        const message = normalized.message;

        return {
          message: Array.isArray(message) || typeof message === "string"
            ? message
            : exception.message,
          error: typeof normalized.error === "string"
            ? normalized.error
            : exception.name,
          details: normalized
        };
      }

      return {
        message: exception.message,
        error: exception.name
      };
    }

    if (exception instanceof Error) {
      return {
        message: exception.message || "Internal server error",
        error: exception.name
      };
    }

    return {
      message: "Internal server error",
      error: "InternalServerError"
    };
  }
}
