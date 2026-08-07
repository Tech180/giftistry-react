export type ItemEnrichIntent = 'create-from-url' | 'update-item' | 'draft-populate';

export interface ItemEnrichPayload {
  intent: ItemEnrichIntent;
  listId: string;
  url: string;
  itemId?: string;
  writeBack?: boolean;
}
