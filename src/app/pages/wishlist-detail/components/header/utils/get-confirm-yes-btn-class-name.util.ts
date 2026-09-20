import type { ConfirmAction } from '../../../interfaces/confirm-action.type';
import styles from '../header.module.css';

export function getConfirmYesBtnClassName(confirmAction: Exclude<ConfirmAction, null>): string {
  const parts = [styles['header__confirm-btn'], styles['header__yes-btn']];
  if (confirmAction === 'activate' || confirmAction === 'deactivate') {
    parts.push(styles['header__yes-btn--warning']);
  }
  if (confirmAction === 'duplicate') {
    parts.push(styles['header__yes-btn--primary']);
  }
  return parts.join(' ');
}
