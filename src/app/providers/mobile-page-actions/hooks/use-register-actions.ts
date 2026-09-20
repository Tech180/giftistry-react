import React, { useEffect } from 'react';
import type { FloatingAction } from 'shared/ui';
import { useMobilePageActions } from '../context';

/**
 * Registers page-scoped FAB actions for the lifetime of the calling component.
 * Clears on unmount so the next route starts clean.
 */
export function useRegisterActions(actions: FloatingAction[]): void {
  const { setPageActions, clearPageActions } = useMobilePageActions();

  useEffect(() => {
    setPageActions(actions);
  }, [actions, setPageActions]);

  useEffect(() => {
    return () => {
      clearPageActions();
    };
  }, [clearPageActions]);
}
