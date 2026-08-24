import type { CompactColumnKey } from '../constants/compact-column-keys.constant';

export type CompactColumnWidths = Partial<Record<CompactColumnKey, number>>;

export type CompactColumnWidthCssVars = Record<string, string>;
