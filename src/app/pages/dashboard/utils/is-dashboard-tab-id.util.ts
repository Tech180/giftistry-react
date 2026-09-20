import type { DashboardTabId } from '../interfaces/dashboard-tab-id.type';

const DASHBOARD_TAB_IDS: readonly DashboardTabId[] = ['my-lists', 'shared', 'archive'];

export function isDashboardTabId(value: string): value is DashboardTabId {
  return (DASHBOARD_TAB_IDS as readonly string[]).includes(value);
}
