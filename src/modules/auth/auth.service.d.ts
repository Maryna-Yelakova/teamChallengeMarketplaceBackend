import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private JWT_ACCESS_TOKEN_TTL;
    private JWT_REFRESH_TOKEN_TTL;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(res: Response, dto: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(res: Response, identityString: string, password: string): Promise<{
        isPhoneValidated: boolean;
        isEmailValidated: boolean;
        accessToken: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    refresh(userId: string, res: Response): {
        accessToken: string;
    };
    validateUser(identityString: string, pass: string): Promise<{
        id: string;
        firstName: string;
        middleName?: string;
        lastName?: string;
        birthDay?: Date;
        phone: string;
        isPhoneValidated: boolean;
        email: string;
        isEmailValidated: boolean;
        isSeller: boolean;
        sellers: import("../../entities/seller.entity").Seller[];
        addresses: import("../../entities/address.entity").Address[];
        carts: import("../../entities/cart.entity").Cart[];
        wishlists: import("../../entities/wishlist.entity").Wishlist[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    private auth;
    private generateTokens;
}
