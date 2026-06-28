import { Item } from 'features/items';

export interface CommentsProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  listId: string;
  isOwner: boolean;
  handleItemTaggedClick: (itemId: string) => void;
}
