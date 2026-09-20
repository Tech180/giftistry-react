import styles from '../settings-panel.module.css';

export function getRowClassName(checked: boolean, readOnly: boolean): string {
  return [
    styles['settings-panel__row'],
    checked ? styles['settings-panel__row--active'] : '',
    readOnly ? styles['settings-panel__row--read-only'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
