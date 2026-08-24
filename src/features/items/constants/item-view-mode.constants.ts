import type { ItemViewMode } from '../types/item-view-mode.type';

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
