import type { Item } from '../../../interfaces/item.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  drawerClass: string;
  matchedItems: Item[];
}
