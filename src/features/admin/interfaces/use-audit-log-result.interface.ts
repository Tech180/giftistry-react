import type { AuditLogEntry } from './audit-log-entry.interface';

export interface UseAuditLogResult {
  entries: AuditLogEntry[];
  action: string;
  page: number;
  total: number;
  totalPages: number;
  showPagination: boolean;
  isLoading: boolean;
  onActionChange: (value: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onUnlock: () => void;
}
