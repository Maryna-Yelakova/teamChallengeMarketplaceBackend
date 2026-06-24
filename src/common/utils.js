"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRefreshToken = exports.setCookie = void 0;
const common_1 = require("@nestjs/common");
const setCookie = (res, value, expires) => {
    res.cookie("refresh_token", value, {
        httpOnly: true,
        expires
    });
};
exports.setCookie = setCookie;
const extractRefreshToken = (req) => {
    const cookies = req.cookies;
    if (typeof cookies.refresh_token !== "string") {
        throw new common_1.UnauthorizedException("No refresh token present");
    }
    return cookies.refresh_token;
};
exports.extractRefreshToken = extractRefreshToken;
//# sourceMappingURL=utils.js.map