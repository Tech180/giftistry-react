import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportJobSummary } from '../interfaces/import-job-summary.interface';

/**
 * Fallback bell/toast copy for item AI jobs when the notification payload
 * has an empty message. Mirrors backend build-item-job-notification-copy.
 */
export function formatItemJobNotificationSummary(
  job: Pick<BackgroundJobView, 'Kind' | 'Status' | 'Error' | 'Message' | 'FileName'> & {
    Payload?: { name?: string; url?: string; linkUrl?: string } | null;
    Result?: Record<string, unknown> | null;
  },
  options: { listTitle?: string | null } = {}
): ImportJobSummary {
  const isEnrich = job.Kind === 'item-enrich';
  const failed = job.Status === 'failed';

  if (failed) {
    return {
      title: isEnrich ? 'Auto-fill failed' : 'Summarize failed',
      message:
        job.Error?.trim() ||
        job.Message?.trim() ||
        (isEnrich
          ? 'Failed to fetch product details automatically.'
          : 'Failed to generate notes automatically.'),
      tone: 'error',
    };
  }

  const listTitle = options.listTitle?.trim() || null;
  const label = resolveItemLabel(job);

  if (isEnrich) {
    return {
      title: listTitle || 'Item ready',
      message: label
        ? `Finished processing “${label}”.`
        : 'Finished processing your item.',
      tone: 'success',
    };
  }

  return {
    title: listTitle || 'Summary ready',
    message: label
      ? `Notes for “${label}” are ready.`
      : 'Your item summary is ready.',
    tone: 'success',
  };
}

function resolveItemLabel(
  job: Pick<BackgroundJobView, 'FileName'> & {
    Payload?: { name?: string; url?: string; linkUrl?: string } | null;
    Result?: Record<string, unknown> | null;
  }
): string | null {
  const resultTitle = job.Result?.Title;
  if (typeof resultTitle === 'string' && resultTitle.trim()) {
    return resultTitle.trim();
  }

  const name = job.Payload?.name?.trim();
  if (name) return name;

  return null;
}
