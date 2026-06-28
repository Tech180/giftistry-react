import { Item } from 'features/items';

export interface AddItemProps {
  isOpen: boolean;
  editingItem: Item | null;
  items: Item[];
  linkedItemIds: string[];
  setLinkedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  listId: string;
  onClose: () => void;
  onSuccess: () => void;
  setEditingItemDraft: (draft: any) => void;
  loadData: () => void;
}
