import { UnauthorizedException } from "@nestjs/common";
import { Request, type Response } from "express";

export const setCookie = (res: Response, value: string, expires: Date) => {
  res.cookie("refresh_token", value, {
    httpOnly: true,
    expires
  });
};

export const extractRefreshToken = (req: Request) => {
  const cookies = req.cookies;
  if (typeof cookies.refresh_token !== "string") {
    throw new UnauthorizedException("No refresh token present");
  }
  return cookies.refresh_token;
};
