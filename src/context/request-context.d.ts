import { AsyncLocalStorage } from "node:async_hooks";
interface Store {
    correlationId: string;
}
export declare const asyncLocalStorage: AsyncLocalStorage<Store>;
export declare const getCorrelationId: () => string | undefined;
export {};
