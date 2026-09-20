import {
  DEFAULT_ITEM_VIEW_MODE,
  ITEM_VIEW_MODE_CONTAINER_CLASS,
  ITEM_VIEW_MODE_LAYOUT_CLASS,
  ITEM_VIEW_MODES,
  KANBAN_FALLBACK_VIEW_MODE,
  LEGACY_ITEM_VIEW_MODE_MAP,
} from '../constants/item-view-mode.constants';
import type { ItemViewMode } from '../interfaces/item-view-mode.type';

export function normalizeStoredViewMode(raw: string | null): ItemViewMode {
  if (!raw) {
    return DEFAULT_ITEM_VIEW_MODE;
  }

  const mapped = LEGACY_ITEM_VIEW_MODE_MAP[raw] ?? raw;
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
  return ITEM_VIEW_MODE_LAYOUT_CLASS[mode];
}

export function getItemsContainerClass(mode: ItemViewMode): string {
  return ITEM_VIEW_MODE_CONTAINER_CLASS[mode];
}
