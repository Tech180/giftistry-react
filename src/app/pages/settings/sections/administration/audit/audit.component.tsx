import React from 'react';
import { getAuditActionClass, useAuditLog } from 'features/admin';
import { formatDateTime } from 'shared/utils/format-date.util';
import { SectionProps } from '../interfaces/section-props.interface';
import { AuditTemplate } from './audit.html';
import { ACTION_CLASS } from './constants/action-class.constant';
import type { AuditEntryRow } from './interfaces/audit-entry-row.interface';

export const Audit: React.FC<SectionProps> = ({ showToast }) => {
  const {
    entries,
    action,
    page,
    totalPages,
    showPagination,
    isLoading,
    onActionChange,
    onRefresh,
    onPageChange,
    onExport,
    onUnlock,
  } = useAuditLog({ showToast });

  const rows: AuditEntryRow[] = entries.map((entry) => {
    const tone = getAuditActionClass(entry.Action);
    return {
      id: entry.Id,
      action: entry.Action,
      actionClassName: tone ? ACTION_CLASS[tone] : undefined,
      actorLabel: entry.ActorUsername ?? '—',
      targetLabel: entry.TargetUsername ?? '—',
      ipLabel: entry.Ip ?? '—',
      timestampLabel: formatDateTime(entry.CreatedAt),
    };
  });

  return (
    <AuditTemplate
      rows={rows}
      action={action}
      page={page}
      totalPages={totalPages}
      showPagination={showPagination}
      isLoading={isLoading}
      onActionChange={onActionChange}
      onRefresh={onRefresh}
      onPageChange={onPageChange}
      onExport={onExport}
      onUnlock={onUnlock}
    />
  );
};
