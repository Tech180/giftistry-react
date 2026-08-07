import type { ItemEnrichIntent } from 'features/jobs/interfaces/item-enrich-payload.interface';

export interface PendingManualJob {
  jobId: string;
  kind: 'enrich' | 'summarize';
  intent?: ItemEnrichIntent;
  url?: string;
}
