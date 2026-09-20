import type { PendingManualJob } from './pending-manual-job.interface';

export interface AbandonPendingManualJobOptions {
  pending: PendingManualJob | null;
  listId: string;
  background: boolean;
}
