import type { CompactCategoryColumnPresence } from '../../../../../interfaces/compact-category-column-presence.interface';

export interface ColumnSyncContextValue {
  columnPresence: CompactCategoryColumnPresence;
  isSyncEnabled: boolean;
}
