import { Item } from './item.interface';

export interface ItemCardProps {
  item: Item;
  isOwner: boolean;
  isExpired: boolean;
  canCollaborate: boolean;
  allowGroupFunds: boolean;
  onUpdate: () => void;
}
