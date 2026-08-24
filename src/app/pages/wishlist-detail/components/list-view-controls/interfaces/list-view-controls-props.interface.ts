import type { ReactNode } from 'react';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';

export interface ListViewControlsProps {
  viewMode: ItemViewMode;
  supportsKanbanViewMode?: boolean;
  handleSetViewMode: (mode: ItemViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItemWidget: ReactNode;
}
