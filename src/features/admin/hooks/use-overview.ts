import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin.api';
import type { AuditLogEntry } from '../interfaces/audit-log-entry.interface';
import type { HookProps } from '../interfaces/hook-props.interface';
import type { OverviewStats } from '../interfaces/overview-stats.interface';
import type { UseOverviewResult } from '../interfaces/use-overview-result.interface';

export function useOverview({ showToast }: HookProps): UseOverviewResult {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentAudit, setRecentAudit] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getOverview()
      .then((res) => {
        setStats(res.Stats);
        setRecentAudit(res.RecentAudit ?? []);
      })
      .catch((err) => showToast(err.message || 'Failed to load overview', 'error'))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  return {
    isLoading,
    stats,
    recentAudit,
  };
}
