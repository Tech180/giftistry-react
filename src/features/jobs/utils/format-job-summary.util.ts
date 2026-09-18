import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportJobSummary } from '../interfaces/import-job-summary.interface';
import { formatImportJobSummary } from './format-import-job-summary.util';
import { formatItemJobNotificationSummary } from './format-item-job-notification-summary.util';
import { isAiPopulateFailed } from './is-ai-populate-failed.util';

/**
 * Terminal toast copy for any job kind. Returns `null` when the outcome does
 * not warrant a toast — successful AI helpers resolve silently in the UI.
 * Soft AI populate failure on completed enrich surfaces an info toast.
 */
export function formatJobTerminalSummary(job: BackgroundJobView): ImportJobSummary | null {
  if (job.Kind === 'item-enrich' || job.Kind === 'item-summarize') {
    if (job.Status === 'failed') {
      const isEnrich = job.Kind === 'item-enrich';
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

    if (
      job.Kind === 'item-enrich' &&
      job.Status === 'completed' &&
      isAiPopulateFailed(job.Result)
    ) {
      return formatItemJobNotificationSummary(job);
    }

    return null;
  }

  return formatImportJobSummary(job);
}
