import { AsyncLocalStorage } from "node:async_hooks";

interface Store {
  correlationId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<Store>();

export const getCorrelationId = (): string | undefined => {
  return asyncLocalStorage.getStore()?.correlationId;
};
