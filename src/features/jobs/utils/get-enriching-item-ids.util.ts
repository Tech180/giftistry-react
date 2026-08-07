import type { BackgroundJobView } from '../interfaces/background-job.interface';

/** Item ids the job is still working on, taken from its in-flight streams. */
export function getEnrichingItemIds(job: BackgroundJobView | null | undefined): string[] {
  if (!job?.ActiveStreams?.length) return [];

  return job.ActiveStreams.filter(
    (stream) => stream.Status === 'pending' || stream.Status === 'running'
  )
    .map((stream) => stream.ItemId)
    .filter((itemId): itemId is string => !!itemId);
}
