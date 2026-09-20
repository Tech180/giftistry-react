import type { UserStatusTone } from '../interfaces/user-status-tone.type';
import shared from '../../shared.module.css';
import styles from '../page.module.css';

export const STATUS_CLASS: Record<UserStatusTone, string> = {
  disabled: `${shared['admin__badge']} ${styles['page__badge--disabled']}`,
  locked: `${shared['admin__badge']} ${shared['admin__badge--locked']}`,
  active: `${shared['admin__badge']} ${styles['page__badge--active']}`,
};
