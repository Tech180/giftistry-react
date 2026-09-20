import type { DashboardTab } from '../../../interfaces/dashboard-tab.interface';
import type { DashboardTabId } from '../../../interfaces/dashboard-tab-id.type';

export interface DashboardControlsProps {
  tabs: DashboardTab[];
  activeTab: DashboardTabId;
  searchQuery: string;
  onTabChange: (tabId: string) => void;
  onSearchChange: (query: string) => void;
}
