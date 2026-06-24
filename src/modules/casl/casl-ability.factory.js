"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../entities/user.entity");
const casl_ability_types_1 = require("./casl-ability.types");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(user) {
        const { can, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        can(casl_ability_types_1.Action.Read, user_entity_1.User, { id: user.id });
        can(casl_ability_types_1.Action.Update, user_entity_1.User, { id: user.id });
        return build({
            detectSubjectType: item => item.constructor
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map