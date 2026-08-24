import {
  COMPACT_COLUMN_CSS_VAR_PREFIX,
  COMPACT_COLUMN_DATA_ATTR,
  COMPACT_COLUMN_MEASURE_ATTR,
  COMPACT_COLUMN_KEYS,
  type CompactColumnKey,
} from '../constants/compact-column-keys.constant';
import type {
  CompactColumnWidthCssVars,
  CompactColumnWidths,
} from '../interfaces/compact-column-widths.interface';

export function isCompactColumnKey(value: string): value is CompactColumnKey {
  return (COMPACT_COLUMN_KEYS as readonly string[]).includes(value);
}

export function measureCompactColumnWidths(
  container: HTMLElement
): CompactColumnWidths {
  const widths: CompactColumnWidths = {};

  for (const key of COMPACT_COLUMN_KEYS) {
    widths[key] = 0;
  }

  const measureNodes = container.querySelectorAll<HTMLElement>(
    `[${COMPACT_COLUMN_MEASURE_ATTR}]`
  );
  const nodes =
    measureNodes.length > 0
      ? measureNodes
      : container.querySelectorAll<HTMLElement>(`[${COMPACT_COLUMN_DATA_ATTR}]`);

  nodes.forEach((node) => {
    const key = node.getAttribute(COMPACT_COLUMN_MEASURE_ATTR)
      ?? node.getAttribute(COMPACT_COLUMN_DATA_ATTR);
    if (!key || !isCompactColumnKey(key)) {
      return;
    }
    const width = node.offsetWidth;
    widths[key] = Math.max(widths[key] ?? 0, width);
  });

  return widths;
}

export function toCompactColumnWidthCssVars(
  widths: CompactColumnWidths,
  activeKeys: ReadonlySet<CompactColumnKey> | CompactColumnKey[]
): CompactColumnWidthCssVars {
  const active = activeKeys instanceof Set ? activeKeys : new Set(activeKeys);
  const vars: CompactColumnWidthCssVars = {};

  for (const key of COMPACT_COLUMN_KEYS) {
    const cssVar = `${COMPACT_COLUMN_CSS_VAR_PREFIX}${key}`;
    if (!active.has(key)) {
      vars[cssVar] = '0px';
      continue;
    }
    const width = widths[key] ?? 0;
    vars[cssVar] = width > 0 ? `${width}px` : 'auto';
  }

  return vars;
}
