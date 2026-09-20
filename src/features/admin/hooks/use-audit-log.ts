import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin.api';
import { AUDIT_PAGE_SIZE } from '../constants/audit-page-size.constant';
import type { AuditLogEntry } from '../interfaces/audit-log-entry.interface';
import type { HookProps } from '../interfaces/hook-props.interface';
import type { UseAuditLogResult } from '../interfaces/use-audit-log-result.interface';
import { exportAuditEntriesCsv } from '../utils/audit.util';

export function useAuditLog({ showToast }: HookProps): UseAuditLogResult {
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
    void load();
  }, [action, page]);

  const totalPages = Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE));

  return {
    entries,
    action,
    page,
    total,
    totalPages,
    showPagination: total > AUDIT_PAGE_SIZE,
    isLoading,
    onActionChange: (value) => {
      setAction(value);
      setPage(1);
    },
    onRefresh: load,
    onPageChange: setPage,
    onExport: () => {
      exportAuditEntriesCsv(entries);
      showToast('Audit log exported', 'success');
    },
    onUnlock: () => showToast('Access logged', 'info'),
  };
}
