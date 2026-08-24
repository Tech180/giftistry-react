import { createContext, useContext } from 'react';
import type { CompactCategoryColumnPresence } from '../../../../interfaces/compact-category-column-presence.interface';

export interface CompactColumnSyncContextValue {
  columnPresence: CompactCategoryColumnPresence;
  isSyncEnabled: boolean;
}

export const DEFAULT_COMPACT_COLUMN_PRESENCE: CompactCategoryColumnPresence = {
  leading: true,
  select: false,
  relations: false,
  audience: false,
  quantity: false,
  price: true,
  funding: false,
  trailing: false,
  claimActions: false,
  wideClaimActions: false,
};

export const CompactColumnSyncContext = createContext<CompactColumnSyncContextValue>({
  columnPresence: DEFAULT_COMPACT_COLUMN_PRESENCE,
  isSyncEnabled: false,
});

export function useCompactColumnSyncContext(): CompactColumnSyncContextValue {
  return useContext(CompactColumnSyncContext);
}
