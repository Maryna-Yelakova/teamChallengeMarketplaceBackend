"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrelationId = exports.asyncLocalStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
exports.asyncLocalStorage = new node_async_hooks_1.AsyncLocalStorage();
const getCorrelationId = () => {
    return exports.asyncLocalStorage.getStore()?.correlationId;
};
exports.getCorrelationId = getCorrelationId;
//# sourceMappingURL=request-context.js.map