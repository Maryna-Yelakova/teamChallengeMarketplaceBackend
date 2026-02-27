import { Request } from "express";
import { AppAbility } from "src/casl/casl-ability.types";
import { User } from "src/entities/user.entity";

export interface AuthUser extends User {
  ability: AppAbility;
}

export type JwtPayload = {
  userId: string;
  identityWay: IdentityWay;
};

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface RequestWithAuthUser extends Request {
  user: AuthUser;
}

export type IdentityWay = "email" | "phone";
