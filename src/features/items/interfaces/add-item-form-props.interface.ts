import { Item } from './item.interface';

export interface AddItemFormProps {
  listId: string;
  isOwner: boolean;
  onSuccess: () => void;
  existingCategories?: string[];
  item?: Item | null;
  onDraftChange?: (draft: Partial<Item> | null) => void;
  wishlistItems?: Item[];
  linkedItemIds: string[];
  setLinkedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  onPriorityChange?: () => void;
  isOpen?: boolean;
}

