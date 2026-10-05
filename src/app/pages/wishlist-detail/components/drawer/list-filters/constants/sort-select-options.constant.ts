import { LIST_DISPLAY_SORT_OPTIONS } from 'features/items';
import type { SelectMenuOption } from 'shared/ui';

export const LIST_FILTERS_SORT_SELECT_OPTIONS: SelectMenuOption[] = LIST_DISPLAY_SORT_OPTIONS.map(
  (option) => ({ value: option.id, label: option.label })
);
