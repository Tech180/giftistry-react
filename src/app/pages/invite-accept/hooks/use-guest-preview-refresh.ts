import { useEffect, useRef } from 'react';
import {
  GUEST_PREVIEW_POLL_INTERVAL_MS,
  GUEST_PREVIEW_REFRESH_DEBOUNCE_MS,
} from '../constants/guest-preview-refresh.constant';
import type { UseGuestPreviewRefreshOptions } from '../interfaces/use-guest-preview-refresh-options.interface';

export function useGuestPreviewRefresh({
  enabled,
  reload,
  debounceMs = GUEST_PREVIEW_REFRESH_DEBOUNCE_MS,
  pollIntervalMs = GUEST_PREVIEW_POLL_INTERVAL_MS,
}: UseGuestPreviewRefreshOptions): void {
  const reloadRef = useRef(reload);
  reloadRef.current = reload;
  const inFlightRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const runReload = async () => {
      if (inFlightRef.current) {
        return;
      }
      inFlightRef.current = true;
      try {
        await reloadRef.current();
      } finally {
        inFlightRef.current = false;
      }
    };

    const scheduleReload = () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        debounceTimerRef.current = null;
        void runReload();
      }, debounceMs);
    };

    let pollTimer: number | null = null;

    const stopPoll = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    const startPoll = () => {
      stopPoll();
      if (document.visibilityState !== 'visible') {
        return;
      }
      pollTimer = window.setInterval(() => {
        void runReload();
      }, pollIntervalMs);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        scheduleReload();
        startPoll();
      } else {
        stopPoll();
      }
    };

    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        scheduleReload();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    startPoll();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      stopPoll();
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [enabled, debounceMs, pollIntervalMs]);
}
