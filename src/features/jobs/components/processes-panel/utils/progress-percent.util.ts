import type { BackgroundJobView } from '../../../interfaces/background-job.interface';

export function progressPercent(job: BackgroundJobView): number {
  if (job.ProgressTotal <= 0) return job.Status === 'queued' ? 0 : 5;
  return Math.max(0, Math.min(100, Math.round((job.ProgressDone / job.ProgressTotal) * 100)));
}
