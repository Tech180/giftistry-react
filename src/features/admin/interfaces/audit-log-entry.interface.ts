export interface AuditLogEntry {
  Id: string;
  Action: string;
  ActorUsername?: string | null;
  TargetUsername?: string | null;
  Ip?: string | null;
  CreatedAt?: string | null;
}
