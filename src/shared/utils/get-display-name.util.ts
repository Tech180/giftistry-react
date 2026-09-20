import type { DisplayNameFields } from '../interfaces/display-name-fields.interface';

export function getDisplayName(fields: DisplayNameFields | null | undefined, fallback = 'User'): string {
  if (!fields) {
    return fallback;
  }

  const first = fields.FirstName?.trim() ?? '';
  const last = fields.LastName?.trim() ?? '';
  if (first || last) {
    return `${first} ${last}`.trim();
  }

  const username = fields.Username?.trim();
  if (username) {
    return username;
  }

  const email = fields.Email?.trim();
  if (email) {
    return email;
  }

  return fallback;
}
