export interface AuditEntryRow {
  id: string;
  action: string;
  actionClassName?: string;
  actorLabel: string;
  targetLabel: string;
  ipLabel: string;
  timestampLabel: string;
}
