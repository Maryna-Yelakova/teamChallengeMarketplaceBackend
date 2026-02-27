import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_POLICIES_KEY, PolicyHandler } from "./decorators/check-policies.decorator";
import { RequestWithAuthUser } from "src/common/types";

// interface RequestWithUser extends Request {
//   user: User;
// }

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest<RequestWithAuthUser>();

    if (!request.user || !request.user.ability) {
      return true;
    }

    const ability = request.user.ability;

    return handlers.every(handler => handler(ability));
  }
}
