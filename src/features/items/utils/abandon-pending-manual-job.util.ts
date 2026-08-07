import { jobsApi } from 'features/jobs/api/jobs.api';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';
import type { PendingManualJob } from '../interfaces/pending-manual-job.interface';

export type AbandonPendingManualJobOutcome = 'promoted' | 'cancelled' | 'left' | 'noop';

export interface AbandonPendingManualJobOptions {
  pending: PendingManualJob | null;
  listId: string;
  background: boolean;
}

/**
 * Handles Manual form close/unmount while an AI job is still in flight.
 * Background + draft-populate → cancel draft and start create-from-url.
 * Foreground → cancel the pending job.
 * Background + update-item/summarize → leave the server job running.
 */
export async function abandonPendingManualJob(
  options: AbandonPendingManualJobOptions
): Promise<{ outcome: AbandonPendingManualJobOutcome; result?: ItemEnrichJobResult }> {
  const { pending, listId, background } = options;
  if (!pending?.jobId) {
    return { outcome: 'noop' };
  }

  if (!background) {
    try {
      await jobsApi.cancelJob(pending.jobId);
    } catch {
      // Best-effort cancel; form is already closing.
    }
    return { outcome: 'cancelled' };
  }

  if (pending.kind === 'enrich' && pending.intent === 'draft-populate' && pending.url?.trim()) {
    try {
      await jobsApi.cancelJob(pending.jobId);
    } catch {
      // Best-effort; still attempt create-from-url.
    }

    const result = await jobsApi.startItemEnrich({
      intent: 'create-from-url',
      listId,
      url: pending.url.trim(),
      writeBack: true,
    });
    return { outcome: 'promoted', result };
  }

  return { outcome: 'left' };
}
