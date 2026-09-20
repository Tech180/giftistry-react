import { parseDateKey } from '../../calendar/utils/parse-date-key.util';

/**
 * Formats a YYYY-MM-DD value for the idle (unfocused) field label.
 * Example: Sep 15, 2026
 */
export function formatDateFieldDisplay(
  dateKey: string | null | undefined,
  placeholder = ''
): string {
  const date = parseDateKey(dateKey);
  if (!date) {
    return placeholder;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a YYYY-MM-DD value for text editing.
 * Example: 09/15/2026
 */
export function formatDateFieldEditValue(dateKey: string | null | undefined): string {
  const date = parseDateKey(dateKey);
  if (!date) {
    return '';
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
}
