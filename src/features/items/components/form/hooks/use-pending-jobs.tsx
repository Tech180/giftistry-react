import { useCallback, useEffect, useRef } from 'react';
import { abandonPendingManualJob } from '../../../utils/abandon-pending-manual-job.util';
import type { PendingManualJob } from '../../../interfaces/pending-manual-job.interface';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';
import type { UsePendingJobsResult } from '../interfaces/use-pending-jobs-result.interface';

export function usePendingJobs(options: {
  listId: string;
  listManualJobBackground?: boolean;
  onAutoEnrichStarted?: (result: ItemEnrichJobResult) => void;
}): UsePendingJobsResult {
  const { listId, listManualJobBackground = true, onAutoEnrichStarted } = options;

  const pendingJobRef = useRef<PendingManualJob | null>(null);
  const jobRunRef = useRef(0);
  const isUnmountedRef = useRef(false);
  const abandonContextRef = useRef({
    listId,
    background: listManualJobBackground !== false,
    onAutoEnrichStarted,
  });
  abandonContextRef.current = {
    listId,
    background: listManualJobBackground !== false,
    onAutoEnrichStarted,
  };

  const runAbandonPendingJob = useCallback(async () => {
    const pending = pendingJobRef.current;
    pendingJobRef.current = null;
    if (!pending) {
      return;
    }

    const { listId: abandonListId, background, onAutoEnrichStarted: onStarted } =
      abandonContextRef.current;
    try {
      const { outcome, result } = await abandonPendingManualJob({
        pending,
        listId: abandonListId,
        background,
      });
      if (outcome === 'promoted' && result) {
        onStarted?.(result);
      }
    } catch {
      // Best-effort; form is already closing.
    }
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      void runAbandonPendingJob();
    };
  }, [runAbandonPendingJob]);

  const startJobRun = useCallback(() => {
    const runId = jobRunRef.current + 1;
    jobRunRef.current = runId;
    return () => isUnmountedRef.current || jobRunRef.current !== runId;
  }, []);

  return {
    pendingJobRef,
    jobRunRef,
    isUnmountedRef,
    abandonContextRef,
    runAbandonPendingJob,
    startJobRun,
  };
}
