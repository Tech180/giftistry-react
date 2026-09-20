import type { ConfirmAction } from '../../../interfaces/confirm-action.type';
import styles from '../header.module.css';

export function getConfirmBannerClassName(confirmAction: Exclude<ConfirmAction, null>): string {
  const parts = [styles['header__confirm-banner']];
  if (confirmAction === 'activate' || confirmAction === 'deactivate') {
    parts.push(styles['header__confirm-banner--warning']);
  }
  if (confirmAction === 'duplicate') {
    parts.push(styles['header__confirm-banner--primary']);
  }
  return parts.join(' ');
}
