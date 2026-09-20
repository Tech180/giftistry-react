import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import styles from '../page.module.css';

export function getPageClassName(
  isItemDrawerVisible: boolean,
  viewMode: ItemViewMode,
  isCommentsOpen: boolean
): string {
  return [
    styles['page'],
    isItemDrawerVisible ? styles['page--add-open'] : '',
    viewMode !== 'grid' && isCommentsOpen ? styles['page--comments-open'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
