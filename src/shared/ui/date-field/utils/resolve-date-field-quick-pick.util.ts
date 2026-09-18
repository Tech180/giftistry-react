import { formatDateKey } from '../../calendar/utils/format-date-key.util';
import type { DateFieldQuickPickId } from '../interfaces/date-field-quick-pick.interface';

export function resolveDateFieldQuickPick(
  id: DateFieldQuickPickId,
  now: Date = new Date()
): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (id === 'tomorrow') {
    date.setDate(date.getDate() + 1);
  } else if (id === 'next-week') {
    date.setDate(date.getDate() + 7);
  } else if (id === 'next-month') {
    date.setMonth(date.getMonth() + 1);
  }

  return formatDateKey(date);
}
