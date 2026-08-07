export interface WaitForJobOptions {
  intervalMs?: number;
  isCancelled?: () => boolean;
}
