import type { DashboardTabId } from '../interfaces/dashboard-tab-id.type';

export const DASHBOARD_TABS: readonly { id: DashboardTabId; label: string }[] = [
  { id: 'my-lists', label: 'My Wishlists' },
  { id: 'shared', label: 'Shared' },
  { id: 'archive', label: 'Archived' },
] as const;
