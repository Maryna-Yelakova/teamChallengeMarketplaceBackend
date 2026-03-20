import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AppAbility } from "../casl-ability.types";
import { RequestWithAuthUser } from "src/common/types";

export const Ability = createParamDecorator((data: unknown, ctx: ExecutionContext): AppAbility => {
  const request = ctx.switchToHttp().getRequest<RequestWithAuthUser>();
  return request.user.ability;
});
