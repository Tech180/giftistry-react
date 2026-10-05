import type { ListDisplaySortKey } from '../interfaces/list-display-sort-key.type';

export const LIST_DISPLAY_SORT_OPTIONS: { id: ListDisplaySortKey; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'name-asc', label: 'Name (A → Z)' },
  { id: 'name-desc', label: 'Name (Z → A)' },
  { id: 'price-asc', label: 'Price (low → high)' },
  { id: 'price-desc', label: 'Price (high → low)' },
  { id: 'available-first', label: 'Available first' },
  { id: 'claimed-first', label: 'Claimed first' },
  { id: 'date-added-desc', label: 'Date added (newest)' },
  { id: 'date-added-asc', label: 'Date added (oldest)' },
  { id: 'funding-progress-desc', label: 'Funding progress (high → low)' },
  { id: 'funding-remaining-asc', label: 'Amount left to fund (low → high)' },
];

export const LIST_DISPLAY_SORT_LABELS: Record<ListDisplaySortKey, string> = Object.fromEntries(
  LIST_DISPLAY_SORT_OPTIONS.map((option) => [option.id, option.label])
) as Record<ListDisplaySortKey, string>;
