"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = correlationMiddleware;
const crypto_1 = require("crypto");
const request_context_1 = require("./request-context");
function correlationMiddleware(req, res, next) {
    const correlationId = req.headers["x-correlation-id"]?.toString() ?? (0, crypto_1.randomUUID)();
    request_context_1.asyncLocalStorage.run({ correlationId }, () => {
        res.setHeader("x-correlation-id", correlationId);
        next();
    });
}
//# sourceMappingURL=correlation.middleware.js.map