import type { BackgroundJobView } from '../../../interfaces/background-job.interface';

export function buildRowMeta(
  job: BackgroundJobView,
  variant: 'user' | 'admin'
): string | null {
  const adminUser =
    variant === 'admin' && job.UserId ? `${job.UserId.slice(0, 8)}…` : null;
  const listLabel = job.ListId ? `list ${job.ListId.slice(0, 8)}…` : null;
  if (!adminUser && !listLabel) return null;
  if (adminUser && listLabel) return `${adminUser} · ${listLabel}`;
  return adminUser ?? listLabel;
}
