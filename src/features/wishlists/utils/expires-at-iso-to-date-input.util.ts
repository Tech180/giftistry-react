/**
 * Converts an ISO / Date-parseable expiry timestamp to a date-only input value
 * (`YYYY-MM-DD`) using the **local** calendar day. Avoids UTC off-by-one from
 * `toISOString().split('T')[0]`.
 */
export function expiresAtIsoToDateInput(
  expiresAt: string | Date | null | undefined
): string {
  if (!expiresAt) return '';
  const date = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
