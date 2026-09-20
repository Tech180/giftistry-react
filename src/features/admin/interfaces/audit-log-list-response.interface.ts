import type { AuditLogEntry } from './audit-log-entry.interface';

export interface AuditLogListResponse {
  Entries: AuditLogEntry[];
  Page: number;
  Total: number;
}
