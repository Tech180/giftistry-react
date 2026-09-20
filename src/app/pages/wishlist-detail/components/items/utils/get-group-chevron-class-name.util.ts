import styles from '../items.module.css';

export function getGroupChevronClassName(isCollapsed: boolean): string {
  return [
    styles['items__group-chevron'],
    isCollapsed ? styles['items__group-chevron--collapsed'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
