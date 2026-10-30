import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

import { LoggerService } from "../logger.service";
import { ContextLogger } from "../types/logger.types";
import { redactSensitiveData } from "../redact-sensitive-data";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: ContextLogger;

  constructor(private readonly baseLogger: LoggerService) {
    this.logger = this.baseLogger.withService(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();

    const { method } = req;
    // The raw URL includes query values; log the path and sanitized fields separately.
    const path = req.path;
    const start = Date.now();

    this.logger.info({
      message: "HTTP Request",
      method,
      path,
      body: redactSensitiveData(req.body),
      query: redactSensitiveData(req.query)
    });

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info({
            message: "HTTP Response",
            method,
            path,
            duration: Date.now() - start
          });
        }
      })
    );
  }
}
