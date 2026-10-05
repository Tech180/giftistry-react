import type { ListDisplayBuiltInPreset } from '../interfaces/list-display-built-in-preset.interface';
import { createDefaultListDisplayFilters } from '../utils/create-default-list-display-filters.util';
import { createDefaultListDisplaySearchScope } from '../utils/create-default-list-display-search-scope.util';

function preset(
  id: string,
  label: string,
  partial: {
    sort?: ListDisplayBuiltInPreset['preferences']['sort'];
    filters?: Partial<ListDisplayBuiltInPreset['preferences']['filters']>;
    searchScope?: Partial<ListDisplayBuiltInPreset['preferences']['searchScope']>;
  }
): ListDisplayBuiltInPreset {
  return {
    id,
    label,
    preferences: {
      sort: partial.sort ?? 'default',
      filters: { ...createDefaultListDisplayFilters(), ...partial.filters },
      searchScope: { ...createDefaultListDisplaySearchScope(), ...partial.searchScope },
    },
  };
}

export const LIST_DISPLAY_BUILT_IN_PRESETS: ListDisplayBuiltInPreset[] = [
  preset('gifter-shopping', 'Gifter shopping', {
    sort: 'available-first',
    filters: {
      availability: 'available',
      itemType: 'product',
      pricePresence: 'has',
    },
  }),
  preset('enrich-queue', 'Enrich queue', {
    filters: {
      hasLink: 'no',
      itemType: 'all',
    },
  }),
  preset('review-suggestions', 'Review suggestions', {
    filters: {
      itemType: 'suggestion',
    },
  }),
  preset('group-fund-almost', 'Group fund almost there', {
    sort: 'funding-progress-desc',
    filters: {
      funding: 'in_progress',
    },
  }),
];
