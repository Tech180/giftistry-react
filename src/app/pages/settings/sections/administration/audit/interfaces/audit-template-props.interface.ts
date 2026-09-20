import type { AuditEntryRow } from './audit-entry-row.interface';

export interface AuditTemplateProps {
  rows: AuditEntryRow[];
  action: string;
  page: number;
  totalPages: number;
  showPagination: boolean;
  isLoading: boolean;
  onActionChange: (value: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onUnlock?: () => void;
}
