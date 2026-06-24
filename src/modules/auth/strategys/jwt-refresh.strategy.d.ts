import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private usersRepo;
    private configService;
    constructor(usersRepo: Repository<User>, configService: ConfigService);
    validate(payload: {
        userId: string;
        identityWay: string;
    }): Promise<{
        userId: string;
        identityWay: string;
    }>;
}
export {};
