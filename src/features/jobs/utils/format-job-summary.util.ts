import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportJobSummary } from '../interfaces/import-job-summary.interface';
import { formatImportJobSummary } from './format-import-job-summary.util';

/**
 * Terminal toast copy for any job kind. Returns `null` when the outcome does
 * not warrant a toast — successful AI helpers resolve silently in the UI.
 */
export function formatJobTerminalSummary(job: BackgroundJobView): ImportJobSummary | null {
  if (job.Kind === 'item-enrich' || job.Kind === 'item-summarize') {
    if (job.Status !== 'failed') return null;

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

  return formatImportJobSummary(job);
}
