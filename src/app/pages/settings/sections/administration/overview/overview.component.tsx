import React from 'react';
import { useOverview } from 'features/admin';
import { formatDateTime } from 'shared/utils/format-date.util';
import { SectionProps } from '../interfaces/section-props.interface';
import { OverviewTemplate } from './overview.html';
import type { OverviewAuditRow } from './interfaces/overview-audit-row.interface';
import type { OverviewStatsView } from './interfaces/overview-stats-view.interface';

export const Overview: React.FC<SectionProps> = ({ showToast }) => {
  const { isLoading, stats, recentAudit } = useOverview({ showToast });

  const statsView: OverviewStatsView | null = stats
    ? {
        totalUsers: stats.Users.Total,
        active7d: stats.Users.Active7d,
        disabled: stats.Users.Disabled,
        locked: stats.Users.Locked,
        activeLists: stats.Lists.Active,
        openReports: stats.OpenReports,
      }
    : null;

  const recentAuditRows: OverviewAuditRow[] = recentAudit.map((entry) => ({
    id: entry.Id,
    action: entry.Action,
    actorLabel: entry.ActorUsername ?? '—',
    targetLabel: entry.TargetUsername ?? '—',
    timestampLabel: formatDateTime(entry.CreatedAt),
  }));

  return (
    <OverviewTemplate
      isLoading={isLoading}
      stats={statsView}
      showMaintenanceBadge={!!stats?.MaintenanceMode}
      recentAuditRows={recentAuditRows}
    />
  );
};
