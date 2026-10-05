import { LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR } from 'features/items/constants/list-display-price-range.constant';

export function listPriceMinStringToSelectorValue(raw: string): number {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    return LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR;
  }
  return Math.floor(num);
}

export function listPriceMinSelectorValueToString(value: number): string {
  if (value === LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR) {
    return '';
  }
  return String(Math.max(0, Math.floor(value)));
}

export function listPriceMaxStringToSelectorValue(raw: string): number {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    return LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR;
  }
  return Math.floor(num);
}

export function listPriceMaxSelectorValueToString(value: number): string {
  if (value === LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR) {
    return '';
  }
  return String(Math.max(0, Math.floor(value)));
}

export function resolveListPriceMaxSelectorChange(
  next: number,
  minSelectorValue: number
): number {
  if (next === LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR) {
    return next;
  }
  if (minSelectorValue === LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR) {
    return next;
  }
  return next < minSelectorValue ? minSelectorValue : next;
}

export { LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR };
