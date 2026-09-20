import { createContext, useContext } from 'react';
import { DEFAULT_COLUMN_PRESENCE } from '../constants/default-column-presence.constant';
import type { ColumnSyncContextValue } from '../interfaces/column-sync-context-value.interface';

export const ColumnSyncContext = createContext<ColumnSyncContextValue>({
  columnPresence: DEFAULT_COLUMN_PRESENCE,
  isSyncEnabled: false,
});

export function useColumnSyncContext(): ColumnSyncContextValue {
  return useContext(ColumnSyncContext);
}
