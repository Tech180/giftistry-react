import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import styles from '../items.module.css';

export function getGroupClassName(viewMode: ItemViewMode, isCollapsed: boolean): string {
  return [
    styles['items__group'],
    isCollapsed ? styles['items__group--collapsed'] : '',
    styles[`items__group--${viewMode}`],
  ]
    .filter(Boolean)
    .join(' ');
}
