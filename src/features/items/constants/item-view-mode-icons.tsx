import React from 'react';
import { LayoutList, Rows, LayoutGrid, Columns3, ListTree } from 'lucide-react';
import type { ItemViewMode } from '../types/item-view-mode.type';

export const ITEM_VIEW_MODE_ICONS: Record<
  ItemViewMode,
  React.ComponentType<{ size?: number }>
> = {
  detailed: LayoutList,
  compact: Rows,
  grid: LayoutGrid,
  kanban: Columns3,
  feed: ListTree,
};
