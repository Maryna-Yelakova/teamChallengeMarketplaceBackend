import { Request } from 'express';

export type JwtPayload = {
  userId: string;
};

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
