import { formatDateKey } from './format-date-key.util';

export function isSameCalendarDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return formatDateKey(a) === formatDateKey(b);
}
