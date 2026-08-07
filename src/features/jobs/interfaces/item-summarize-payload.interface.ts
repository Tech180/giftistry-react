import type { ItemCustomFields } from 'shared/interfaces/item-description-metadata.interface';

export interface ItemSummarizeVariation {
  Name: string;
  Quantity: number;
}

export interface ItemSummarizePayload {
  listId: string;
  itemId?: string;
  writeBack: boolean;
  name: string;
  text?: string;
  linkUrl?: string;
  websiteName?: string;
  price?: number | null;
  category?: string;
  priority?: number | null;
  customFields?: ItemCustomFields;
  variations?: ItemSummarizeVariation[];
  desiredQuantity?: number;
}
