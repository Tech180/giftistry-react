import styles from '../settings-panel.module.css';

export function getRowMetaClassName(checked: boolean): string {
  return [
    styles['settings-panel__row-meta'],
    checked ? styles['settings-panel__row-meta--active'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
