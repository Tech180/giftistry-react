import type { Item } from 'features/items';

export interface BuildDraftSourceItemInput {
  editingItem: Item | null;
  editingItemDraft: Partial<Item> | null;
  isAddOpen: boolean;
  canCollaborate: boolean;
  wishlistId: string | undefined;
}
