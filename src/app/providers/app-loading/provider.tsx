import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AppLoadingContext } from './context';

export const AppLoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const entriesRef = useRef<Map<string, string>>(new Map());
  const fallbackCounterRef = useRef(0);
  const [message, setMessage] = useState<string | null>(null);

  const syncMessage = useCallback(() => {
    const entries = entriesRef.current;
    if (entries.size === 0) {
      setMessage(null);
      return;
    }
    const values = Array.from(entries.values());
    setMessage(values[values.length - 1]);
  }, []);

  const show = useCallback(
    (next: string, id?: string) => {
      const entryId = id ?? `manual_${++fallbackCounterRef.current}`;
      entriesRef.current.set(entryId, next);
      syncMessage();
    },
    [syncMessage]
  );

  const clear = useCallback(
    (id?: string) => {
      if (id) {
        entriesRef.current.delete(id);
      } else {
        const keys = Array.from(entriesRef.current.keys());
        if (keys.length > 0) {
          entriesRef.current.delete(keys[keys.length - 1]);
        }
      }
      syncMessage();
    },
    [syncMessage]
  );

  const value = useMemo(
    () => ({
      message,
      show,
      clear,
    }),
    [message, show, clear]
  );

  return (
    <AppLoadingContext.Provider
      value = {
        value
      }
    >
      {
        children
      }
    </AppLoadingContext.Provider>
  );
};
