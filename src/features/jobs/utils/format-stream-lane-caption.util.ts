import type { JobProgressRate } from '../interfaces/background-job.interface';
import { formatProgressRate } from './format-progress-rate.util';

/** Build stream lane detail: `Categorizing… · 40 tok/s` (omit missing segments). */
export function formatStreamLaneDetail(
  detail: string | null | undefined,
  rate: JobProgressRate | null | undefined
): string {
  const parts: string[] = [];
  if (detail?.trim()) parts.push(detail.trim());
  const formattedRate = formatProgressRate(rate);
  if (formattedRate) parts.push(formattedRate);
  return parts.join(' · ');
}

/** Full stream caption for title/display: `Label · Detail · tok/s`. */
export function formatStreamLaneCaption(
  label: string,
  detail: string | null | undefined,
  rate: JobProgressRate | null | undefined
): string {
  const suffix = formatStreamLaneDetail(detail, rate);
  return suffix ? `${label} · ${suffix}` : label;
}
