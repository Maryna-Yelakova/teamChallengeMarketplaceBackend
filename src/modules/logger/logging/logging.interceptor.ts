import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLoggerService } from '../logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query, headers } = req;
    const start = Date.now();

    this.logger.log(
      `Request: ${method} ${url} - body: ${JSON.stringify(body)} - query: ${JSON.stringify(query)}`,
      'HTTP'
    );

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - start;
        this.logger.log(`${method} ${url} - ${time}ms`, 'HTTP');
      }),
    );
  }
}
