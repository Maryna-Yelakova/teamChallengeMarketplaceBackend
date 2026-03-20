import { AbilityBuilder, createMongoAbility, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Action, Subjects, AppAbility } from "./casl-ability.types";

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
