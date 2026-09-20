import styles from '../settings-panel.module.css';

export function getRootClassName(readOnly: boolean): string {
  return [
    styles['settings-panel'],
    readOnly ? styles['settings-panel--read-only'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
