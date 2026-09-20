import type { TabId } from '../interfaces/tab-id.type';

const TAB_IDS: readonly TabId[] = ['current', 'requests', 'search'];

export function isTabId(value: string): value is TabId {
  return (TAB_IDS as readonly string[]).includes(value);
}
