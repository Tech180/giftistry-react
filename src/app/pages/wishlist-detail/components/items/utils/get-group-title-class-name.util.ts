import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import styles from '../items.module.css';

export function getGroupTitleClassName(viewMode: ItemViewMode, isCollapsed: boolean, isFirst: boolean): string {
  return [
    styles['items__group-title'],
    isCollapsed ? styles['items__group-title--collapsed'] : '',
    isFirst ? styles['items__group-title--first'] : '',
    styles[`items__group-title--${viewMode}`],
  ]
    .filter(Boolean)
    .join(' ');
}
