import type { AuditLogEntry } from './audit-log-entry.interface';
import type { OverviewStats } from './overview-stats.interface';

export interface UseOverviewResult {
  isLoading: boolean;
  stats: OverviewStats | null;
  recentAudit: AuditLogEntry[];
}
