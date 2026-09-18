import type { ItemEnrichIntent } from 'features/jobs/interfaces/item-enrich-payload.interface';

export interface ResolveItemEnrichRequestResult {
  intent: Extract<ItemEnrichIntent, 'draft-populate' | 'update-item'>;
  itemId: string | undefined;
  writeBack: boolean;
}
