import { useLayoutEffect, useState, type DependencyList, type RefObject } from 'react';
import {
  COMPACT_MOBILE_MAX_WIDTH,
  type CompactColumnKey,
} from '../constants/compact-column-keys.constant';
import type { CompactColumnWidthCssVars } from '../interfaces/compact-column-widths.interface';
import {
  measureCompactColumnWidths,
  toCompactColumnWidthCssVars,
} from '../utils/measure-compact-column-widths.util';

function isCompactMobileLayout(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia(`(max-width: ${COMPACT_MOBILE_MAX_WIDTH})`).matches;
}

export function useCompactColumnSync(
  containerRef: RefObject<HTMLElement | null>,
  activeKeys: ReadonlySet<CompactColumnKey> | CompactColumnKey[],
  deps: DependencyList = []
): CompactColumnWidthCssVars {
  const [vars, setVars] = useState<CompactColumnWidthCssVars>(() =>
    toCompactColumnWidthCssVars({}, activeKeys)
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let frame = 0;

    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (isCompactMobileLayout()) {
          setVars(toCompactColumnWidthCssVars({}, activeKeys));
          return;
        }

        const widths = measureCompactColumnWidths(container);
        setVars(toCompactColumnWidthCssVars(widths, activeKeys));
      });
    };

    remeasure();

    const observer = new ResizeObserver(() => {
      remeasure();
    });
    observer.observe(container);

    const nodes = container.querySelectorAll('[data-compact-col]');
    nodes.forEach((node) => observer.observe(node));

    window.addEventListener('resize', remeasure);

    const mobileQuery = window.matchMedia(`(max-width: ${COMPACT_MOBILE_MAX_WIDTH})`);
    mobileQuery.addEventListener('change', remeasure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
      mobileQuery.removeEventListener('change', remeasure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls remeasure via deps
  }, [containerRef, activeKeys, ...deps]);

  return vars;
}
