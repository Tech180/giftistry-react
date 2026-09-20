import styles from '../settings-panel.module.css';

export function getRowIconClassName(iconClassName?: string): string {
  return [styles['settings-panel__row-icon'], iconClassName].filter(Boolean).join(' ');
}
