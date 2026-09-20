import { SWITCHER_ACCOUNTS_STORAGE_KEY } from '../constants/switcher-accounts-storage-key.constant';
import type { SwitcherAccount } from '../interfaces/switcher-account.interface';

export function readSwitcherAccounts(): SwitcherAccount[] {
  const raw = localStorage.getItem(SWITCHER_ACCOUNTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map((entry) => {
    const acc = entry as Partial<SwitcherAccount> & { Email?: string | null };
    return {
      Username: acc.Username || acc.Email || '',
      Email: acc.Email ?? null,
      FirstName: acc.FirstName ?? null,
      LastName: acc.LastName ?? null,
      Avatar: acc.Avatar ?? null,
      HasPasskey: acc.HasPasskey,
    };
  });
}
