import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import styles from '../items.module.css';

export function getGroupsClassName(viewMode: ItemViewMode): string {
  return [styles['items__groups'], styles[`items__groups--${viewMode}`]].filter(Boolean).join(' ');
}
