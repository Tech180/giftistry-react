import type { RefCallback } from 'react';

export interface UseDashboardGridColumnsResult {
  columns: number;
  gridRef: RefCallback<HTMLDivElement>;
}
