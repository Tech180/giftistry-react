import type { BackgroundJobStatus } from '../interfaces/background-job.interface';
import type { ImportTimelineStepId } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';

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
