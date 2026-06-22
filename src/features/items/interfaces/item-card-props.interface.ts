import { Item } from './item.interface';

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
  viewMode?: 'full' | 'compact' | 'grid';
  isSelected?: boolean;
  onSelect?: () => void;
}
