import type { ItemViewMode } from '../interfaces/item-view-mode.type';

export const ITEM_VIEW_MODE_STORAGE_KEY = 'giftistry_view_mode';

export const DEFAULT_ITEM_VIEW_MODE: ItemViewMode = 'detailed';

export const ITEM_VIEW_MODES: ItemViewMode[] = [
  'detailed',
  'compact',
  'grid',
  'kanban',
  'feed',
];

export const ITEM_VIEW_MODE_LABELS: Record<ItemViewMode, string> = {
  detailed: 'Detailed',
  compact: 'Compact',
  grid: 'Grid',
  kanban: 'Kanban',
  feed: 'Feed',
};

/** Kanban is only offered at the desktop drawer / ultra-wide breakpoint. */
export const KANBAN_VIEW_MODE_MIN_WIDTH_MEDIA_QUERY = '(min-width: 75rem)';

export const KANBAN_FALLBACK_VIEW_MODE: ItemViewMode = 'detailed';

/** Maps persisted legacy view-mode keys to current ItemViewMode values. */
export const LEGACY_ITEM_VIEW_MODE_MAP: Record<string, ItemViewMode> = {
  full: 'detailed',
};

export const ITEM_VIEW_MODE_LAYOUT_CLASS: Record<ItemViewMode, string> = {
  detailed: 'layout-detailed',
  compact: 'layout-compact',
  grid: 'layout-grid',
  kanban: 'layout-kanban',
  feed: 'layout-feed',
};

export const ITEM_VIEW_MODE_CONTAINER_CLASS: Record<ItemViewMode, string> = {
  detailed: 'items-container-detailed',
  compact: 'items-container-compact',
  grid: 'items-container-grid',
  kanban: 'items-container-kanban',
  feed: 'items-container-feed',
};
