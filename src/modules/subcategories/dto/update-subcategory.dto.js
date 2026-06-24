"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubcategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_subcategory_dto_1 = require("./create-subcategory.dto");
class UpdateSubcategoryDto extends (0, swagger_1.PartialType)(create_subcategory_dto_1.CreateSubcategoryDto) {
}
exports.UpdateSubcategoryDto = UpdateSubcategoryDto;
//# sourceMappingURL=update-subcategory.dto.js.map