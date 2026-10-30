import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

/** Native clients exchange the securely stored refresh token in the JSON body. */
export const extractRefreshToken = (req: Request) => {
  const token = (req.body as { refreshToken?: unknown } | undefined)?.refreshToken;
  if (typeof token !== "string") {
    throw new UnauthorizedException("No refresh token present");
  }
  return token;
};
