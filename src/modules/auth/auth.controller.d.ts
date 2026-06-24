import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import type { Response } from "express";
import { RequestWithUser } from "../../common/types";
import { LoginUserDto } from "../users/dtos/login-user.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(res: Response, createUserDto: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(res: Response, loginUserDto: LoginUserDto): Promise<{
        isPhoneValidated: boolean;
        isEmailValidated: boolean;
        accessToken: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    refresh(req: RequestWithUser, res: Response): {
        accessToken: string;
    };
}
