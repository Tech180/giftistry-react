import type { ItemEnrichIntent } from 'features/jobs/interfaces/item-enrich-payload.interface';

export interface PendingManualJob {
  jobId: string;
  kind: 'enrich' | 'summarize';
  intent?: ItemEnrichIntent;
  url?: string;
  /**
   * When false, closing the form cancels a draft-populate job instead of promoting
   * it to create-from-url. Omit/true keeps Add Item background-promote behavior.
   */
  promoteOnClose?: boolean;
}
