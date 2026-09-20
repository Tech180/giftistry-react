import type { BackgroundJobStatus } from '../interfaces/background-job.interface';
import type { ImportTimelineStepId } from 'features/items/components/import/strip/interfaces/import-timeline-step.interface';

export const TERMINAL_JOB_STATUSES: BackgroundJobStatus[] = [
  'completed',
  'failed',
  'cancelled',
];

export const DEFAULT_JOB_POLL_INTERVAL_MS = 1500;

export const JOBS_PAYLOAD_WRAPPER_KEYS = ['Jobs', 'Data', 'Items', 'Result'] as const;

export const IMPORT_TIMELINE_STEP_ORDER: ImportTimelineStepId[] = [
  'upload',
  'found',
  'created',
  'finalized',
  'grabInfo',
  'savedDetails',
];

/** Kinds whose active streams map onto item cards that should show a skeleton. */
export const ITEM_STREAM_KINDS = new Set(['item-enrich', 'wishlist-import']);

/** Matches a trailing client-only elapsed suffix on step metrics (e.g. ` · 24s`). */
export const ELAPSED_METRIC_TAIL = /\s·\s\d+s$/;
