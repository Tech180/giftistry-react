import { Item } from 'features/items';

export interface CommentsTemplateProps {
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
