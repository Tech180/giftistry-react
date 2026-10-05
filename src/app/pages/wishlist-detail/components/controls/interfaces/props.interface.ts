import type { ReactNode } from 'react';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import type { UseListDisplayPreferencesResult } from '../../../interfaces/use-list-display-preferences-result.interface';

export interface Props {
  viewMode: ItemViewMode;
  supportsKanbanViewMode?: boolean;
  handleSetViewMode: (mode: ItemViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItemWidget: ReactNode;
  listDisplay: UseListDisplayPreferencesResult;
}
