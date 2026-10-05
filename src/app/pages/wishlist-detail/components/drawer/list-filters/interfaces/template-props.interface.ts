import type { ListDisplayPreferences, ListFilterCapabilities } from 'features/items';
import type { CategoryFilterOption } from 'features/items/utils/build-category-filter-options.util';
import type { ListFiltersViewModel } from './list-filters-view-model.interface';

export type TemplateProps = {
  isDrawerOpen: boolean;
  onClose: () => void;
  draft: ListDisplayPreferences;
  capabilities: ListFilterCapabilities;
  categoryOptions: CategoryFilterOption[];
  hasUnsavedDraft: boolean;
  onUpdateDraft: (updater: (prev: ListDisplayPreferences) => ListDisplayPreferences) => void;
  onClearDraft: () => void;
  onRevertDraft: () => void;
  onApplyDraft: () => void;
} & ListFiltersViewModel;
