import { Item } from './item.interface';
import { ItemViewMode } from '../types/item-view-mode.type';

export interface ItemCardProps {
  item: Item;
  isOwner: boolean;
  isExpired: boolean;
  canCollaborate: boolean;
  allowGroupFunds: boolean;
  onUpdate: () => void;
  priorityLabel?: string;
  onEdit?: () => void;
  isTaggingModeActive?: boolean;
  isTaggedSelection?: boolean;
  onSelectTag?: () => void;
  viewMode?: ItemViewMode;
  isSelected?: boolean;
  onSelect?: () => void;
  wishlistItems?: Item[];
  isLinkingContext?: boolean;
  aiEnabled?: boolean;
}
