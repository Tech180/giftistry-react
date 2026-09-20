import { useCallback, useRef, useState } from 'react';
import type { UseDashboardGridColumnsResult } from '../interfaces/use-dashboard-grid-columns-result.interface';

export function useDashboardGridColumns(): UseDashboardGridColumnsResult {
  const [columns, setColumns] = useState(1);
  const observerRef = useRef<ResizeObserver | null>(null);

  const gridRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const gridTemplate = window
          .getComputedStyle(entry.target)
          .getPropertyValue('grid-template-columns');
        setColumns(gridTemplate.trim().split(/\s+/).length);
      }
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return { columns, gridRef };
}
