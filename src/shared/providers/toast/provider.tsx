import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Host } from './components/host/host.component';
import { TOAST_DISMISS_MS } from './constants/dismiss.constant';
import { ToastContext } from './context';
import type { ToastItem } from './interfaces/item.interface';

let nextToastId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutIdsRef = useRef<Map<number, number>>(new Map());

  const clearToastTimeout = (id: number) => {
    const timeoutId = timeoutIdsRef.current.get(id);
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }
  };

  const dismissToast = useCallback((id: number) => {
    clearToastTimeout(id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = nextToastId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      const timeoutId = window.setTimeout(() => {
        timeoutIdsRef.current.delete(id);
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, TOAST_DISMISS_MS);
      timeoutIdsRef.current.set(id, timeoutId);
    },
    [],
  );

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider
      value = {
        value
      }
    >
      {children}
      <Host
        toasts = {
          toasts
        }
        onDismiss = {
          dismissToast
        }
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
