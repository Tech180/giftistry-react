import { useEffect, useRef, useState } from 'react';
import { DEV_INACTIVITY_TIMEOUT_STORAGE_KEY } from '../constants/storage-keys.constant';
import {
  INACTIVITY_ACTIVITY_EVENTS,
  INACTIVITY_COUNTDOWN_TICK_MS,
  INACTIVITY_DEFAULT_TIMEOUT_MS,
  INACTIVITY_WARNING_COUNTDOWN_SEC,
} from '../constants/inactivity.constant';
import type { UseInactivityOptions } from '../interfaces/use-inactivity-options.interface';
import type { UseInactivityResult } from '../interfaces/use-inactivity-result.interface';

export function useInactivity({ user, onTimeoutLogout }: UseInactivityOptions): UseInactivityResult {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(INACTIVITY_WARNING_COUNTDOWN_SEC);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutLogoutRef = useRef(onTimeoutLogout);
  const showWarningRef = useRef(showWarning);

  onTimeoutLogoutRef.current = onTimeoutLogout;
  showWarningRef.current = showWarning;

  const cleanupInactivityTimers = () => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const resetInactivityTimer = () => {
    if (!user) {
      return;
    }

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // If warning is currently showing, don't auto-reset it silently (user must click to extend)
    if (showWarningRef.current) {
      return;
    }

    const stored = localStorage.getItem(DEV_INACTIVITY_TIMEOUT_STORAGE_KEY);
    const timeoutDuration = stored
      ? parseInt(stored || String(INACTIVITY_DEFAULT_TIMEOUT_MS), 10)
      : INACTIVITY_DEFAULT_TIMEOUT_MS;

    activityTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(INACTIVITY_WARNING_COUNTDOWN_SEC);
    }, timeoutDuration);
  };

  const extendSession = () => {
    setShowWarning(false);
    setCountdown(INACTIVITY_WARNING_COUNTDOWN_SEC);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    resetInactivityTimer();
  };

  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const handleActivity = () => {
        resetInactivityTimer();
      };

      for (const event of INACTIVITY_ACTIVITY_EVENTS) {
        window.addEventListener(event, handleActivity);
      }

      return () => {
        for (const event of INACTIVITY_ACTIVITY_EVENTS) {
          window.removeEventListener(event, handleActivity);
        }
        cleanupInactivityTimers();
      };
    }

    cleanupInactivityTimers();
    setShowWarning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, showWarning]);

  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            onTimeoutLogoutRef.current();
            return 0;
          }

          return prev - 1;
        });
      }, INACTIVITY_COUNTDOWN_TICK_MS);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [showWarning]);

  return {
    showWarning,
    countdown,
    extendSession,
    cleanupInactivityTimers,
    setShowWarning,
  };
}
