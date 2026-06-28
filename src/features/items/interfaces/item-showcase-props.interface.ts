import { Item } from './item.interface';

export interface ItemShowcaseProps {
  item: Item;
  priorityLabel?: string;
  isOwner: boolean;
  isExpired: boolean;
  canCollaborate: boolean;
  allowGroupFunds: boolean;
  onUpdate: () => void;
  onEdit: () => void;
  onClose: () => void;
  wishlistItems?: Item[];
}
