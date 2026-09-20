import React from 'react';
import { LayoutList, Rows, LayoutGrid, Columns3, ListTree, type LucideProps } from 'lucide-react';
import type { ItemViewMode } from '../interfaces/item-view-mode.type';

export const ITEM_VIEW_MODE_ICONS: Record<ItemViewMode, React.ComponentType<LucideProps>> = {
  detailed: LayoutList,
  compact: Rows,
  grid: LayoutGrid,
  kanban: Columns3,
  feed: ListTree,
};
