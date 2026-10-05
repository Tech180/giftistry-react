import type {
  ListDisplayPreferences,
  ListFilterCapabilities,
} from 'features/items';
import type { AddedByFilterOption } from 'features/items/utils/build-added-by-filter-options.util';
import type { CategoryFilterOption } from 'features/items/utils/build-category-filter-options.util';

export interface UseListDisplayPreferencesResult {
  appliedPreferences: ListDisplayPreferences;
  draftPreferences: ListDisplayPreferences | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  capabilities: ListFilterCapabilities;
  categoryOptions: CategoryFilterOption[];
  addedByOptions: AddedByFilterOption[];
  openDrawer: () => void;
  closeDrawer: () => void;
  applyDraft: () => void;
  clearDraft: () => void;
  resetAppliedFilters: () => void;
  revertDraft: () => void;
  updateDraft: (updater: (prev: ListDisplayPreferences) => ListDisplayPreferences) => void;
  activeFilterCount: number;
  matchingCount: number;
  hasUnsavedDraft: boolean;
}
