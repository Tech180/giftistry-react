import type { FormatRelativePastOlderStyle } from './format-relative-past-older-style.type';

export interface FormatRelativePastOptions {
  /** Minutes under this threshold render as "Just now". Use 0 to skip. Default 1. */
  justNowUnderMinutes?: number;
  empty?: string;
  olderStyle?: FormatRelativePastOlderStyle;
}
