import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const resp = exception.getResponse();
    const message =
      typeof resp === "object" && resp !== null && "message" in resp
        ? resp.message
        : exception.message;

    response.status(status).json({
      statusCode: status,
      error: "Unauthorized",
      message,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
