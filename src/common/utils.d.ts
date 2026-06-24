import { Request, type Response } from "express";
export declare const setCookie: (res: Response, value: string, expires: Date) => void;
export declare const extractRefreshToken: (req: Request) => string;
