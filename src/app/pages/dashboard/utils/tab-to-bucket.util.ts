import type { DashboardTabId } from '../interfaces/dashboard-tab-id.type';

const TAB_TO_BUCKET = {
  'my-lists': 'my',
  shared: 'shared',
  archive: 'archive',
} as const;

export type DashboardBucket = (typeof TAB_TO_BUCKET)[DashboardTabId];

export const tabToBucket = (tab: DashboardTabId): DashboardBucket => TAB_TO_BUCKET[tab];
