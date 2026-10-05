import type { ListFilterCapabilities } from 'features/items';
import type { ListDisplayPreferences } from 'features/items';
import type { AddedByFilterOption } from 'features/items/utils/build-added-by-filter-options.util';
import type { SelectMenuOption } from 'shared/ui';
import type { ListFiltersViewModel } from '../interfaces/list-filters-view-model.interface';
import { LIST_FILTERS_SORT_SELECT_OPTIONS } from '../constants/sort-select-options.constant';
import {
  listPriceMaxStringToSelectorValue,
  listPriceMinStringToSelectorValue,
} from './list-price-range-selector.util';

function buildMatchingSummary(matchingCount: number): string {
  if (matchingCount === 0) {
    return 'No matching items';
  }
  return `${matchingCount} item${matchingCount === 1 ? '' : 's'} will be shown`;
}

function buildAddedBySelectOptions(addedByOptions: AddedByFilterOption[]): SelectMenuOption[] {
  return addedByOptions.map((option) => ({ value: option.id, label: option.label }));
}

export function buildListFiltersViewModel(input: {
  draft: ListDisplayPreferences;
  addedByOptions: AddedByFilterOption[];
  capabilities: ListFilterCapabilities;
  matchingCount: number;
}): ListFiltersViewModel {
  const { draft, addedByOptions, capabilities, matchingCount } = input;

  const priceMinSelectorValue = listPriceMinStringToSelectorValue(draft.filters.priceMin);

  return {
    sortSelectOptions: LIST_FILTERS_SORT_SELECT_OPTIONS,
    addedBySelectOptions: buildAddedBySelectOptions(addedByOptions),
    priceMinSelectorValue,
    priceMaxSelectorValue: listPriceMaxStringToSelectorValue(draft.filters.priceMax),
    applyLabel: 'Apply',
    matchingSummary: buildMatchingSummary(matchingCount),
    showSuggestionsOnlyFilter: capabilities.showSuggestionsType,
    suggestionsOnly: draft.filters.itemType === 'suggestion',
  };
}
