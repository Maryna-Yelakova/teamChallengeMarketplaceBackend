import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ForbiddenError } from "@casl/ability";
import { AppAbility } from "../casl-ability.types";
export declare class CaslExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost): void;
}
