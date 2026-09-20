import type { FloatingAction } from 'shared/ui';

export interface ContextValue {
  pageActions: FloatingAction[];
  setPageActions: (actions: FloatingAction[]) => void;
  clearPageActions: () => void;
}
