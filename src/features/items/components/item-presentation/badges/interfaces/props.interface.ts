import { Item } from '../../../../interfaces/item.interface';

export interface Props {
  item: Item;
  audienceLabel: string | null;
  isPrivate: boolean;
  showPriority?: boolean;
}
