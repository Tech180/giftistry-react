import { Item } from 'features/items';

export interface CommentsProps {
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
  isArchived?: boolean;
  autoRollover?: boolean;
  handleItemTaggedClick: (itemId: string, returnToItemId?: string) => void;
  /** When true, tagging mode hides the comments drawer so the list is selectable (overlay / mobile). */
  collapseDrawerWhileTagging?: boolean;
}
