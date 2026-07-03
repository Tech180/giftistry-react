import { Item } from 'features/items';
import { MiniDrawerProps } from './mini-drawer-props.interface';

export interface MiniDrawerTemplateProps extends MiniDrawerProps {
  drawerClass: string;
  matchedItems: Item[];
}
