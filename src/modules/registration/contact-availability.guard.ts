import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import type { Request } from "express";

/** Bounds public availability lookups per client; no contact values or account details are stored. */
@Injectable()
export class ContactAvailabilityGuard implements CanActivate {
  private readonly clients = new Map<string, { count: number; resetAt: number }>();

  canActivate(context: ExecutionContext): boolean {
    const now = Date.now();
    for (const [key, entry] of this.clients) {
      if (entry.resetAt <= now) this.clients.delete(key);
    }
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.ip || request.socket.remoteAddress || "unknown";
    const previous = this.clients.get(key);
    if ((previous && previous.count >= 30) || (!previous && this.clients.size >= 10_000)) {
      throw new HttpException(
        "Too many contact checks. Try again shortly.",
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    this.clients.set(key, {
      count: (previous?.count || 0) + 1,
      resetAt: previous?.resetAt || now + 60_000
    });
    return true;
  }
}
