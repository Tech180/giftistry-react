import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import type { ImportTimelineStepId } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';

/** Format a whole-second elapsed suffix for legacy label-style captions. */
export function formatElapsedSuffix(elapsedSeconds: number): string {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 1) return '';
  return ` · ${Math.floor(elapsedSeconds)}s`;
}

/** Whole-second elapsed for metric field (no leading middot). */
export function formatElapsedSeconds(elapsedSeconds: number): string {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 1) return '';
  return `${Math.floor(elapsedSeconds)}s`;
}

const ELAPSED_METRIC_TAIL = /\s·\s\d+s$/;

/**
 * Append elapsed time to the metric on active steps in `stepIds`.
 * Server/rate values stay on `metric`; elapsed is client-only.
 */
export function withActiveStepCaptions(
  steps: ImportTimelineStep[],
  options: {
    stepIds: ImportTimelineStepId[];
    elapsedSeconds: number;
  }
): ImportTimelineStep[] {
  const elapsed = formatElapsedSeconds(options.elapsedSeconds);
  if (!elapsed) return steps;

  const ids = new Set(options.stepIds);
  return steps.map((step) => {
    if (!ids.has(step.id) || step.tone !== 'active') {
      return step;
    }
    const baseMetric = (step.metric ?? '').replace(ELAPSED_METRIC_TAIL, '');
    const metric = baseMetric ? `${baseMetric} · ${elapsed}` : elapsed;
    return { ...step, metric };
  });
}

/**
 * Append elapsed time to the active "found" (Finding items) step metric.
 * @deprecated Prefer withActiveStepCaptions for multi-step captions.
 */
export function withFoundStepElapsed(
  steps: ImportTimelineStep[],
  elapsedSeconds: number
): ImportTimelineStep[] {
  return withActiveStepCaptions(steps, {
    stepIds: ['found'],
    elapsedSeconds,
  });
}
