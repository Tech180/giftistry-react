import React, { useEffect, useState } from 'react';
import { adminApi } from 'features/admin';
import type { AdminOverviewStats, AuditLogEntry } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminOverviewTabTemplate } from './admin-overview-tab.html';

export const AdminOverviewTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
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

  return (
    <AdminOverviewTabTemplate
      isLoading={isLoading}
      stats={stats}
      recentAudit={recentAudit}
    />
  );
};
