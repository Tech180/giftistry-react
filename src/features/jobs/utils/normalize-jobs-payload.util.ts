import type { BackgroundJobView } from '../interfaces/background-job.interface';

const WRAPPER_KEYS = [
  'Jobs',
  'jobs',
  'Data',
  'data',
  'Items',
  'items',
  'Result',
  'result',
] as const;

function tryUnwrap(value: unknown): BackgroundJobView[] | null {
  if (Array.isArray(value)) {
    return value as BackgroundJobView[];
  }
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  for (const key of WRAPPER_KEYS) {
    if (!(key in record)) continue;
    const found = tryUnwrap(record[key]);
    if (found !== null) return found;
  }

  return null;
}

export function normalizeJobsPayload(next: unknown): BackgroundJobView[] {
  return tryUnwrap(next) ?? [];
}
