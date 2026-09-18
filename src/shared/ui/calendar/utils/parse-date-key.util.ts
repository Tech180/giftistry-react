/**
 * Parses a YYYY-MM-DD string into a local Date at midnight.
 * Returns null when the value is empty or invalid.
 */
export function parseDateKey(dateKey: string | null | undefined): Date | null {
  if (!dateKey) {
    return null;
  }
  const trimmed = dateKey.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}
