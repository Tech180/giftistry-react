import {
  DEFAULT_ITEM_VIEW_MODE,
  ITEM_VIEW_MODES,
  KANBAN_FALLBACK_VIEW_MODE,
} from '../constants/item-view-mode.constants';
import type { ItemViewMode } from '../types/item-view-mode.type';

const LEGACY_MODE_MAP: Record<string, ItemViewMode> = {
  full: 'detailed',
};

export function normalizeStoredViewMode(raw: string | null): ItemViewMode {
  if (!raw) {
    return DEFAULT_ITEM_VIEW_MODE;
  }

  const mapped = LEGACY_MODE_MAP[raw] ?? raw;
  if (ITEM_VIEW_MODES.includes(mapped as ItemViewMode)) {
    return mapped as ItemViewMode;
  }

  return DEFAULT_ITEM_VIEW_MODE;
}

export function isKanbanViewMode(mode: ItemViewMode): boolean {
  return mode === 'kanban';
}

export function resolveEffectiveViewMode(
  mode: ItemViewMode,
  supportsKanban: boolean
): ItemViewMode {
  if (isKanbanViewMode(mode) && !supportsKanban) {
    return KANBAN_FALLBACK_VIEW_MODE;
  }
  return mode;
}

export function getSelectableViewModes(supportsKanban: boolean): ItemViewMode[] {
  return ITEM_VIEW_MODES.filter((mode) => supportsKanban || mode !== 'kanban');
}

export function getLayoutClass(mode: ItemViewMode): string {
  return `layout-${mode}`;
}

export function getItemsContainerClass(mode: ItemViewMode): string {
  switch (mode) {
    case 'compact':
      return 'items-container-compact';
    case 'grid':
      return 'items-container-grid';
    case 'kanban':
      return 'items-container-kanban';
    case 'feed':
      return 'items-container-feed';
    case 'detailed':
    default:
      return 'items-container-detailed';
  }
}
