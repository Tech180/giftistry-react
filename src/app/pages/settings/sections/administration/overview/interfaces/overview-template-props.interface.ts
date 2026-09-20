import type { OverviewAuditRow } from './overview-audit-row.interface';
import type { OverviewStatsView } from './overview-stats-view.interface';

export interface OverviewTemplateProps {
  isLoading: boolean;
  stats: OverviewStatsView | null;
  showMaintenanceBadge: boolean;
  recentAuditRows: OverviewAuditRow[];
}
