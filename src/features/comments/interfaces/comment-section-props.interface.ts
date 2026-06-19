import { Item } from 'features/items';

export interface CommentSectionProps {
  listId: string;
  isOwner: boolean;
  items?: Item[];
  onItemTaggedClick?: (itemId: string) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (val: boolean) => void;
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
}
