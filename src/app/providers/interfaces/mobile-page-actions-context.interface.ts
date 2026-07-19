import type { FloatingAction } from 'shared/ui';

export interface MobilePageActionsContextValue {
  pageActions: FloatingAction[];
  setPageActions: (actions: FloatingAction[]) => void;
  clearPageActions: () => void;
}
