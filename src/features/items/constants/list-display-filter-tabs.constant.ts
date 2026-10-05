export const LIST_DISPLAY_FILTER_TABS = ['sort', 'filter', 'more'] as const;

export type ListDisplayFilterTabId = (typeof LIST_DISPLAY_FILTER_TABS)[number];

export const LIST_DISPLAY_FILTER_TAB_LABELS: Record<ListDisplayFilterTabId, string> = {
  sort: 'Sort',
  filter: 'Filter',
  more: 'More',
};
