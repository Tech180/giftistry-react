import type { Dispatch, SetStateAction } from 'react';
import type { Wishlist } from 'features/wishlists';
import type { Item, ItemActions } from 'features/items';

export interface Props {
  selectedItem: Item | null;
  selectedItemPriorityLabel: string | undefined;
  setSelectedItemId: (id: string | null) => void;
  isCommentsOpen: boolean;
  setIsCommentsOpen: Dispatch<SetStateAction<boolean>>;
  isPublicGuest?: boolean;
  wishlist: Wishlist;
  items: Item[];
  displayItems: Item[];
  isOwner: boolean;
  isExpired: boolean;
  isArchived: boolean;
  canCollaborate: boolean;
  isLocked: boolean;
  itemActions: ItemActions;
  openItemEditor: (item: Item) => void;
  openClaimerSubstitutionCreate: (item: Item) => void;
  openClaimerSubstitutionEdit: (item: Item) => void;
  deleteClaimerSubstitution: (item: Item) => Promise<void>;
  openSubstitutionEdit: (item: Item, substitutionId: string) => void;
  deleteSubstitutionOption: (substitutionId: string) => Promise<void>;
  handleItemTaggedClick: (itemId: string, returnToItemId?: string) => void;
  onLinkedItemsUnsupported: () => void;
  showDeletedComments: boolean;
  onToggleShowDeletedComments: () => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  isReplyTaggingModeActive: boolean;
  setIsReplyTaggingModeActive: (active: boolean) => void;
  replyTaggedItemIds: string[];
  setReplyTaggedItemIds: (ids: string[]) => void;
}
