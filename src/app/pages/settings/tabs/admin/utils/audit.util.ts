export function getAuditActionClass(action: string): 'primary' | 'error' | null {
  if (action.includes('failed') || action.includes('error') || action.includes('deleted')) {
    return 'error';
  }
  if (
    action.includes('updated') ||
    action.includes('created') ||
    action.includes('reset') ||
    action.includes('policy')
  ) {
    return 'primary';
  }
  return null;
}

export function exportAuditEntriesCsv(
  entries: Array<{
    Action: string;
    ActorUsername?: string | null;
    TargetUsername?: string | null;
    Ip?: string | null;
    CreatedAt?: string | null;
  }>
) {
  const header = ['Action', 'Actor', 'Target', 'IP', 'Timestamp'];
  const rows = entries.map((e) => [
    e.Action,
    e.ActorUsername ?? '',
    e.TargetUsername ?? '',
    e.Ip ?? '',
    e.CreatedAt ? new Date(e.CreatedAt).toISOString() : '',
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
