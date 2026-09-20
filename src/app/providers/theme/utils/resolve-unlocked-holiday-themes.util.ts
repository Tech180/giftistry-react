import { STANDARD_THEME_IDS } from 'core/theme/constants/theme-catalog.constant';
import { getHolidayUnlockRules } from 'core/theme/utils/theme-catalog.util';
import type { Theme } from '../interfaces/theme.type';

export function resolveUnlockedHolidayThemes(
  unlockedThemes: Theme[],
  createdAt: string | undefined | null,
  now = new Date(),
): Theme[] | null {
  if (!createdAt) {
    return null;
  }

  const createdDate = new Date(createdAt);
  const currentMonth = now.getMonth();
  let currentUnlocked = [...unlockedThemes];
  let changed = false;

  for (const holiday of getHolidayUnlockRules()) {
    if (currentMonth === holiday.month) {
      const maxRegDate = new Date(now.getFullYear(), holiday.month, holiday.lastDay, 23, 59, 59);
      if (createdDate <= maxRegDate && !currentUnlocked.includes(holiday.theme as Theme)) {
        currentUnlocked.push(holiday.theme as Theme);
        changed = true;
      }
    }
  }

  if (!changed) {
    return null;
  }

  return Array.from(new Set([...STANDARD_THEME_IDS, ...currentUnlocked])) as Theme[];
}
