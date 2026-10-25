import { Request } from "express";
import { AppAbility } from "src/modules/casl/casl-ability.types";
import { User } from "src/entities/user.entity";

export interface AuthUser extends User {
  ability: AppAbility;
}

/** Token purpose separates pending registration, API access, and refresh sessions. */
export type JwtPayload = {
  userId: string;
  identityWay?: IdentityWay;
  tokenType?: "access" | "refresh" | "registration";
  tokenVersion?: number;
  tokenId?: string;
};

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface RequestWithAuthUser extends Request {
  user: AuthUser;
}

export type IdentityWay = "email" | "phone";
