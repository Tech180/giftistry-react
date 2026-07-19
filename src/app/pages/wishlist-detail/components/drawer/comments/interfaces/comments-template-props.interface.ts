import { Item } from 'features/items';

export interface CommentsTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  isReplyTaggingModeActive: boolean;
  setIsReplyTaggingModeActive: (active: boolean) => void;
  replyTaggedItemIds: string[];
  setReplyTaggedItemIds: (ids: string[]) => void;
  listId: string;
  listOwnerId: string;
  ownerUsername?: string;
  ownerDisplayName?: string;
  isOwner: boolean;
  isExpired?: boolean;
  handleItemTaggedClick: (itemId: string) => void;
}
