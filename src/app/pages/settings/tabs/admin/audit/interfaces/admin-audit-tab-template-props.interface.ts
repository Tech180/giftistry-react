import type { AuditLogEntry } from 'features/admin';

export interface AdminAuditTabTemplateProps {
  entries: AuditLogEntry[];
  action: string;
  page: number;
  total: number;
  isLoading: boolean;
  onActionChange: (value: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onUnlock?: () => void;
}
