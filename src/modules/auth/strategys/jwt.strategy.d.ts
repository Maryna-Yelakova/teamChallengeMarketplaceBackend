import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory";
import { AppAbility } from "src/modules/casl/casl-ability.types";
import { IdentityWay } from "src/common/types";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepo;
    private configService;
    private caslAbilityFactory;
    constructor(usersRepo: Repository<User>, configService: ConfigService, caslAbilityFactory: CaslAbilityFactory);
    validate(payload: {
        userId: string;
        identityWay: IdentityWay;
        exp: number;
    }): Promise<{
        userId: string;
        identityWay: IdentityWay;
        ability: AppAbility;
    }>;
}
export {};
