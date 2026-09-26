export interface UseGuestPreviewRefreshOptions {
  enabled: boolean;
  reload: () => Promise<void>;
  debounceMs?: number;
  pollIntervalMs?: number;
}
