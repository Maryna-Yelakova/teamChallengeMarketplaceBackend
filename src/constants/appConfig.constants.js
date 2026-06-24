"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.swaggerOptions = exports.bearerAuthConfig = void 0;
exports.bearerAuthConfig = {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "JWT",
    description: "Enter JWT token",
    in: "header"
};
exports.swaggerOptions = {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
};
exports.PORT = process.env.PORT ?? 3000;
//# sourceMappingURL=appConfig.constants.js.map