import { Request } from "express";

export type JwtPayload = {
  userId: string;
  identityWay: IdentityWay;
};

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export type IdentityWay = "email" | "phone";
