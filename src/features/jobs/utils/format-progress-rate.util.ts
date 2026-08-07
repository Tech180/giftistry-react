import type { JobProgressRate } from '../interfaces/background-job.interface';

/** Format a structured job progress rate for timeline captions. */
export function formatProgressRate(
  rate: JobProgressRate | null | undefined
): string {
  if (!rate || !(rate.Value > 0)) return '';
  if (rate.Unit === 'items/s' && rate.Value < 10 && !Number.isInteger(rate.Value)) {
    return `${rate.Value.toFixed(1)} ${rate.Unit}`;
  }
  return `${rate.Value} ${rate.Unit}`;
}

/** Append ` · {rate}` when a rate is present. */
export function withRateSuffix(
  label: string,
  rate: JobProgressRate | null | undefined
): string {
  const formatted = formatProgressRate(rate);
  return formatted ? `${label} · ${formatted}` : label;
}
