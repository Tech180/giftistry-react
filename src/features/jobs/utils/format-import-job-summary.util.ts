import type { BackgroundJobView } from '../interfaces/background-job.interface';

export type ImportJobSummaryTone = 'success' | 'info' | 'error';

export interface ImportJobSummary {
  message: string;
  tone: ImportJobSummaryTone;
  title: string;
}

function resultNumber(result: Record<string, unknown> | undefined, key: string): number {
  const raw = result?.[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

export function formatImportJobSummary(job: BackgroundJobView): ImportJobSummary {
  if (job.Status === 'failed') {
    return {
      title: 'Import failed',
      message: job.Error?.trim() || job.Message?.trim() || 'Import failed',
      tone: 'error',
    };
  }

  if (job.Status === 'cancelled') {
    return {
      title: 'Import cancelled',
      message: job.Message?.trim() || 'Import cancelled',
      tone: 'info',
    };
  }

  const created = resultNumber(job.Result, 'Created');
  const grabFailed = resultNumber(job.Result, 'GrabFailed');
  const parts: string[] = [];

  if (created > 0) {
    parts.push(`${created} item${created === 1 ? '' : 's'} added`);
  } else if (job.Message?.includes('added')) {
    /* keep empty — fall through to Message */
  } else {
    parts.push('0 items added');
  }

  if (grabFailed > 0) {
    parts.push(`${grabFailed} grab failure${grabFailed === 1 ? '' : 's'}`);
  }

  const message =
    parts.length > 0
      ? `Import finished — ${parts.join(', ')}`
      : job.Message?.trim() || 'Import finished';

  return {
    title: 'Import complete',
    message,
    tone: grabFailed > 0 ? 'info' : 'success',
  };
}
