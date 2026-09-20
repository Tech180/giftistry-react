import type { ReactNode, RefObject } from 'react';
import type { FloatingAction } from 'shared/ui';
import type { ImportStripHandle } from 'features/items';
import type { DashboardCard } from './dashboard-card.interface';
import type { DashboardTab } from './dashboard-tab.interface';
import type { DashboardTabId } from './dashboard-tab-id.type';

export interface UseDashboardResult {
  pageActions: FloatingAction[];
  greeting: string;
  isCreateOpen: boolean;
  isImportOpen: boolean;
  canShowAi: boolean;
  importStripRef: RefObject<ImportStripHandle | null>;
  activeTab: DashboardTabId;
  searchQuery: string;
  tabs: DashboardTab[];
  cards: DashboardCard[];
  isLoading: boolean;
  error: string | null;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDesc: string;
  showCreateAction: boolean;
  gridRef: (node: HTMLDivElement | null) => void;
  columns: number;
  onToggleImport: () => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onTabChange: (tabId: string) => void;
  onSearchChange: (query: string) => void;
  onCreateSuccess: () => void;
  onImportStarted: (result: { listId: string; jobId: string; created: number; failed: number }) => void;
}
