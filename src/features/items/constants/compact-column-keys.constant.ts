export const COMPACT_COLUMN_KEYS = [
  'leading',
  'select',
  'relations',
  'audience',
  'quantity',
  'price',
  'funding',
  'trailing',
  'claimActions',
] as const;

export type CompactColumnKey = (typeof COMPACT_COLUMN_KEYS)[number];

export const COMPACT_COLUMN_DATA_ATTR = 'data-compact-col';

export const COMPACT_COLUMN_MEASURE_ATTR = 'data-compact-col-measure';

export const COMPACT_COLUMN_CSS_VAR_PREFIX = '--compact-col-';

/** Match compact-item-view.module.css mobile layout breakpoint. */
export const COMPACT_MOBILE_MAX_WIDTH = '48rem';
