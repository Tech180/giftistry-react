import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FloatingActionMenu, type FloatingAction } from 'shared/ui';
import { useAuth } from 'app/providers/auth-context';
import type { MobilePageActionsContextValue } from './interfaces/mobile-page-actions-context.interface';

const MobilePageActionsContext = createContext<MobilePageActionsContextValue | undefined>(
  undefined
);

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
    [pageActions, setPageActions, clearPageActions]
  );

  return (
    <MobilePageActionsContext.Provider value={value}>
      {children}
    </MobilePageActionsContext.Provider>
  );
};

export function useMobilePageActions(): MobilePageActionsContextValue {
  const context = useContext(MobilePageActionsContext);
  if (!context) {
    throw new Error('useMobilePageActions must be used within a MobilePageActionsProvider');
  }
  return context;
}

/**
 * Registers page-scoped FAB actions for the lifetime of the calling component.
 * Clears on unmount so the next route starts clean.
 */
export function useRegisterPageActions(actions: FloatingAction[]): void {
  const { setPageActions, clearPageActions } = useMobilePageActions();

  useEffect(() => {
    setPageActions(actions);
    return () => {
      clearPageActions();
    };
    // Callers should memoize `actions` (useMemo) so this does not thrash every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, setPageActions, clearPageActions]);
}

export const MobilePageActionsHost: React.FC = () => {
  const { user } = useAuth();
  const { pageActions } = useMobilePageActions();

  if (!user || pageActions.length === 0) {
    return null;
  }

  return <FloatingActionMenu actions={pageActions} ariaLabel="Page actions" />;
};
