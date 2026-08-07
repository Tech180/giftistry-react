import { Item } from './item.interface';
import type { ItemActions } from './item-actions.interface';

export interface ItemShowcaseProps {
  item: Item;
  priorityLabel?: string;
  isOwner: boolean;
  isExpired: boolean;
  isArchived?: boolean;
  canCollaborate: boolean;
  allowGroupFunds: boolean;
  itemActions: ItemActions;
  onEdit: () => void;
  onClose: () => void;
  wishlistItems?: Item[];
  aiEnabled?: boolean;
  variant?: 'card' | 'inline';
}
