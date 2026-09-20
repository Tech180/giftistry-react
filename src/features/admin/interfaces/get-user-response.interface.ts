import type { AuditLogEntry } from './audit-log-entry.interface';
import type { User } from './user.interface';

export interface GetUserResponse {
  User: User;
  Activity: AuditLogEntry[];
}
