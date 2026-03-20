import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import { asyncLocalStorage } from "./request-context";

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers["x-correlation-id"]?.toString() ?? randomUUID();

  asyncLocalStorage.run({ correlationId }, () => {
    res.setHeader("x-correlation-id", correlationId);
    next();
  });
}
