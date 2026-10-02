export interface WaitForJobOptions {
  intervalMs?: number;
  isCancelled?: () => boolean;
  /** When set with unsubscribe, prefer user-socket job events over aggressive HTTP poll. */
  subscribe?: (type: string, handler: (data: unknown) => void) => void;
  unsubscribe?: (type: string, handler: (data: unknown) => void) => void;
}
