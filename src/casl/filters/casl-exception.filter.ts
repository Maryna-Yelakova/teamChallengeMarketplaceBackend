import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { ForbiddenError } from "@casl/ability";
import { Response } from "express";
import { AppAbility } from "../casl-ability.types";

@Catch(ForbiddenError)
export class CaslExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message: `Access denied, reason: ${exception.message}`,
      error: "Forbidden"
    });
  }
}
