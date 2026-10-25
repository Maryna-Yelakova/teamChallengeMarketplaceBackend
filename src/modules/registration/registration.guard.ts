import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

/** Requires a registration-purpose JWT; service methods additionally enforce account state. */
@Injectable()
export class JwtRegistrationGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: Record<string, unknown> }>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new UnauthorizedException("Registration session required");
    try {
      const payload = await this.jwt.verifyAsync<Record<string, unknown>>(token, {
        secret: this.config.getOrThrow<string>("JWT_SECRET")
      });
      if (payload.tokenType !== "registration" || typeof payload.userId !== "string") {
        throw new UnauthorizedException("Registration session required");
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Registration session expired or invalid");
    }
  }
}
