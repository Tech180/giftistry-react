import type { ReactNode } from 'react';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';

export interface Props {
  viewMode: ItemViewMode;
  supportsKanbanViewMode?: boolean;
  handleSetViewMode: (mode: ItemViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItemWidget: ReactNode;
}
