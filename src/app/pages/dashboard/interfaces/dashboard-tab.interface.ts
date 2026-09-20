import type { DashboardTabId } from './dashboard-tab-id.type';

export interface DashboardTab {
  id: DashboardTabId;
  label: string;
  count: number;
}
