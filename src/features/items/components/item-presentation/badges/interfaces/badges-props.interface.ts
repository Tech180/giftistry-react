import { Item } from '../../../../interfaces/item.interface';

export interface BadgesProps {
  item: Item;
  audienceLabel: string | null;
  isPrivate: boolean;
  showPriority?: boolean;
}
