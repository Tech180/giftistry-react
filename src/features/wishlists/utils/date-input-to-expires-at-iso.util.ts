/**
 * Converts a date-only input value (`YYYY-MM-DD`) to an ISO timestamp at local
 * end-of-day so timezone shifts do not leave a newly chosen day already expired.
 * Empty string clears expiration.
 */
export function dateInputToExpiresAtIso(dateInput: string): string | null {
  const trimmed = dateInput.trim();
  if (!trimmed) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const localEndOfDay = new Date(year, month, day, 23, 59, 59, 999);
  if (isNaN(localEndOfDay.getTime())) return null;
  return localEndOfDay.toISOString();
}
