import React, { useEffect, useState } from 'react';
import { adminApi } from 'features/admin';
import type { AuditLogEntry } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminAuditTabTemplate } from './admin-audit-tab.html';
import { exportAuditEntriesCsv } from '../utils/audit.util';

export const AdminAuditTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAuditLog({ action, page });
      setEntries(res.Entries ?? []);
      setTotal(res.Total ?? 0);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load audit log', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [action, page]);

  return (
    <AdminAuditTabTemplate
      entries={entries}
      action={action}
      page={page}
      total={total}
      isLoading={isLoading}
      onActionChange={(value) => {
        setAction(value);
        setPage(1);
      }}
      onRefresh={load}
      onPageChange={setPage}
      onExport={() => {
        exportAuditEntriesCsv(entries);
        showToast('Audit log exported', 'success');
      }}
      onUnlock={() => showToast('Access logged', 'info')}
    />
  );
};
