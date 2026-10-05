import type { SelectMenuOption } from 'shared/ui';
import type { ListFilterItemTypeOption } from './list-filter-item-type-option.interface';

export interface ListFiltersViewModel {
  sortSelectOptions: SelectMenuOption[];
  addedBySelectOptions: SelectMenuOption[];
  priceMinSelectorValue: number;
  priceMaxSelectorValue: number;
  applyLabel: string;
  matchingSummary: string;
  showSuggestionsOnlyFilter: boolean;
  suggestionsOnly: boolean;
}
