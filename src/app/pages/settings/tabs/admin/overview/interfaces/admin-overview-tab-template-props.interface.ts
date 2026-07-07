import { AdminOverviewStats, AuditLogEntry } from 'features/admin';

export interface AdminOverviewTabTemplateProps {
  isLoading: boolean;
  stats: AdminOverviewStats | null;
  recentAudit: AuditLogEntry[];
}
