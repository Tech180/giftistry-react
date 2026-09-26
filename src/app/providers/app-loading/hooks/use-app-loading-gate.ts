import { useId, useLayoutEffect } from 'react';
import { useAppLoading } from '../context';

/** Drive the app-level LoadingState host while `active` is true. */
export function useAppLoadingGate(active: boolean, message: string): void {
  const gateId = useId();
  const { show, clear } = useAppLoading();

  useLayoutEffect(() => {
    if (!active) {
      return;
    }

    show(message, gateId);
    return () => {
      clear(gateId);
    };
  }, [active, message, show, clear, gateId]);
}
