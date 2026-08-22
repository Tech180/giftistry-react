import { AI_HELPER_MANUAL_SUFFIX } from '../constants/ai-helper-failure.constants';

const ORIGINAL_ERROR_MARKER = '\nOriginal error:';

function reasonFromError(err: unknown): string {
  if (!(err instanceof Error)) return '';
  const raw = err.message.trim();
  if (!raw) return '';
  const markerAt = raw.indexOf(ORIGINAL_ERROR_MARKER);
  if (markerAt === -1) return raw;
  return raw.slice(0, markerAt).trim();
}

/** User-facing copy for enrich/summarize failures, with a manual-entry fallback. */
export function formatAiHelperFailure(err: unknown, fallback: string): string {
  const reason = reasonFromError(err) || fallback.trim();
  if (reason.includes(AI_HELPER_MANUAL_SUFFIX)) return reason;
  return `${reason}\n${AI_HELPER_MANUAL_SUFFIX}`;
}
