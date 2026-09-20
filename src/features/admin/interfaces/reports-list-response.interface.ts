import type { ContentReport } from './content-report.interface';

export interface ReportsListResponse {
  Reports: ContentReport[];
  Page: number;
  Total: number;
}
