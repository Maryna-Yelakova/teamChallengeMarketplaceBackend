export type ContextLogger = {
  info: (payload: Record<string, unknown>) => void;
  error: (payload: Record<string, unknown>) => void;
  warn: (payload: Record<string, unknown>) => void;
  debug: (payload: Record<string, unknown>) => void;
};
