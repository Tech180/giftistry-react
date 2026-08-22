import { Item } from './item.interface';
import { ItemViewMode } from '../types/item-view-mode.type';
import type { ItemActions } from './item-actions.interface';

export interface ItemCardProps {
  item: Item;
  isOwner: boolean;
  isExpired: boolean;
  isArchived?: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  allowGroupFunds: boolean;
  itemActions: ItemActions;
  priorityLabel?: string;
  onEdit?: () => void;
  isTaggingModeActive?: boolean;
  isTaggedSelection?: boolean;
  onSelectTag?: () => void;
  viewMode?: ItemViewMode;
  isSelected?: boolean;
  onSelect?: () => void;
  /** Opens read-only View Item drawer (viewers / public guests). */
  onView?: () => void;
  wishlistItems?: Item[];
  isLinkingContext?: boolean;
  isRelatingContext?: boolean;
  aiEnabled?: boolean;
}
