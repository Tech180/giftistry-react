import type { Item } from 'features/items';

export interface UseItemAssociationsOptions {
  items: Item[];
  isAddOpen: boolean;
  editingItem: Item | null;
  viewingItem: Item | null;
  editingItemDraft: Partial<Item> | null;
  canCollaborate: boolean;
  wishlistId: string | undefined;
}
