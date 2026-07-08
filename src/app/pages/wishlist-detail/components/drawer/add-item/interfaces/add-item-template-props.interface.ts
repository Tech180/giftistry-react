import { Item } from 'features/items';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { LinkingAudienceContext } from 'features/items/utils/item-audience.util';

export interface AddItemTemplateProps {
  isOpen: boolean;
  editingItem: Item | null;
  items: Item[];
  linkableItems: Item[];
  resolvedLinkedItems: Item[];
  linkedItemIds: string[];
  setLinkedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  handleLinkingAudienceChange: (context: LinkingAudienceContext) => void;
  isOwner: boolean;
  listId: string;
  listShares: ListShare[];
  onClose: () => void;
  onSuccess: () => void;
  setEditingItemDraft: (draft: any) => void;
  loadData: () => void;
  isLoading?: boolean;
  isFormDirty?: boolean;
  onFormLoadingChange?: (loading: boolean) => void;
  onFormDirtyChange?: (dirty: boolean) => void;
  onItemTaggedClick?: (itemId: string) => void;
}
