import type { SortOption } from '../interfaces/sort-option.interface';

export const SORT_OPTIONS: readonly SortOption[] = [
  { id: 'name', label: 'Name (A-Z)' },
  { id: 'recent', label: 'Recently Added' },
  { id: 'birthday', label: 'Upcoming Birthdays' },
] as const;
