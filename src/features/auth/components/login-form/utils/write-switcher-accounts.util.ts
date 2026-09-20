import { SWITCHER_ACCOUNTS_STORAGE_KEY } from '../constants/switcher-accounts-storage-key.constant';
import type { SwitcherAccount } from '../interfaces/switcher-account.interface';

export function writeSwitcherAccounts(accounts: SwitcherAccount[]) {
  localStorage.setItem(SWITCHER_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}
