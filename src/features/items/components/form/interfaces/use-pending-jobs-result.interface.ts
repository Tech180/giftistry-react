import type React from 'react';
import type { PendingManualJob } from '../../../interfaces/pending-manual-job.interface';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';

export interface UsePendingJobsResult {
  pendingJobRef: React.RefObject<PendingManualJob | null>;
  jobRunRef: React.RefObject<number>;
  isUnmountedRef: React.RefObject<boolean>;
  abandonContextRef: React.RefObject<{
    listId: string;
    background: boolean;
    onAutoEnrichStarted?: (result: ItemEnrichJobResult) => void;
  }>;
  runAbandonPendingJob: () => Promise<void>;
  startJobRun: () => () => boolean;
}
