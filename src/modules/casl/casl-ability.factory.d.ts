import { User } from "src/entities/user.entity";
import { AppAbility } from "./casl-ability.types";
export declare class CaslAbilityFactory {
    createForUser(user: User): AppAbility;
}
