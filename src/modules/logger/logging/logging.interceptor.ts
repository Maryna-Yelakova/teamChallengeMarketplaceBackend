import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

import { LoggerService } from "../logger.service";
import { ContextLogger } from "../types/logger.types";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: ContextLogger;

  constructor(private readonly baseLogger: LoggerService) {
    this.logger = this.baseLogger.withService(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();

    const { method, url, body, query } = req as {
      method: string;
      url: string;
      body?: unknown;
      query?: unknown;
    };

    const start = Date.now();

    this.logger.info({
      message: "HTTP Request",
      method,
      url,
      body,
      query
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;

          this.logger.info({
            message: "HTTP Response",
            method,
            url,
            duration
          });
        }
      })
    );
  }
}
