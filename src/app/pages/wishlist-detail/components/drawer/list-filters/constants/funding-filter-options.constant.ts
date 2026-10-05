import type { SelectMenuOption } from 'shared/ui';

export const LIST_FUNDING_FILTER_OPTIONS: SelectMenuOption[] = [
  { value: 'all', label: 'Any funding state' },
  { value: 'none', label: 'Not group-funded' },
  { value: 'not_started', label: 'GF — Not started' },
  { value: 'in_progress', label: 'GF — In progress' },
  { value: 'fully_funded', label: 'GF — Fully funded' },
];

export const LIST_FUNDING_FILTER_MENU_TITLE = 'Group funding';
