import type { TabId } from '../interfaces/tab-id.type';
import { isTabId } from './is-tab-id.util';

export function parseTab(value: string | null): TabId | null {
  if (value && isTabId(value)) {
    return value;
  }

  return null;
}
