import type { AuditLogEntry } from './audit-log-entry.interface';
import type { OverviewStats } from './overview-stats.interface';

export interface OverviewResponse {
  Stats: OverviewStats;
  RecentAudit: AuditLogEntry[];
}
