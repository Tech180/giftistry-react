import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportJobSummary } from '../interfaces/import-job-summary.interface';

/**
 * Fallback bell/toast copy for item AI jobs when the notification payload
 * has an empty message. Mirrors backend build-item-job-notification-copy.
 */
export function formatItemJobNotificationSummary(
  job: Pick<BackgroundJobView, 'Kind' | 'Status' | 'Error' | 'Message' | 'FileName'> & {
    Payload?: { name?: string; url?: string; linkUrl?: string } | null;
  }
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

  const label = resolveItemLabel(job);
  if (isEnrich) {
    return {
      title: 'Item ready',
      message: label
        ? `Finished processing “${label}”.`
        : 'Finished processing your item.',
      tone: 'success',
    };
  }

  return {
    title: 'Summary ready',
    message: label
      ? `Notes for “${label}” are ready.`
      : 'Your item summary is ready.',
    tone: 'success',
  };
}

function resolveItemLabel(
  job: Pick<BackgroundJobView, 'FileName'> & {
    Payload?: { name?: string; url?: string; linkUrl?: string } | null;
  }
): string | null {
  const name = job.Payload?.name?.trim();
  if (name) return name;

  const url = job.Payload?.url?.trim() || job.Payload?.linkUrl?.trim();
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url.slice(0, 48);
    }
  }

  return null;
}
