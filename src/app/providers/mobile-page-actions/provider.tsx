import React, { useCallback, useMemo, useState } from 'react';
import type { FloatingAction } from 'shared/ui';
import { MobilePageActionsContext } from './context';

export const MobilePageActionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pageActions, setPageActionsState] = useState<FloatingAction[]>([]);

  const setPageActions = useCallback((actions: FloatingAction[]) => {
    setPageActionsState(actions);
  }, []);

  const clearPageActions = useCallback(() => {
    setPageActionsState([]);
  }, []);

  const value = useMemo(
    () => ({
      pageActions,
      setPageActions,
      clearPageActions,
    }),
    [pageActions, setPageActions, clearPageActions],
  );

  return (
    <MobilePageActionsContext.Provider
      value = {
        value
      }
    >
      {children}
    </MobilePageActionsContext.Provider>
  );
};
