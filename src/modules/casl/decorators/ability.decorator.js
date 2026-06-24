"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
const common_1 = require("@nestjs/common");
exports.Ability = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.ability;
});
//# sourceMappingURL=ability.decorator.js.map