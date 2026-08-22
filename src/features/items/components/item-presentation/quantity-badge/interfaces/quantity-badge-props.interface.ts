import type { Item } from '../../../../interfaces/item.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export interface QuantityBadgeProps {
  item: Item;
  metadata?: ItemDescriptionMetadata | null;
  isOwner?: boolean;
  className?: string;
}
