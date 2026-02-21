import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { AppLoggerService } from "../logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: AppLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();
    const request = ctx.getRequest<{ url: string }>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error(`Exception: ${exception.message}`, exception.stack, request.url);

    response.status(status).json({
      statusCode: status,
      message: exception.message
    });
  }
}
