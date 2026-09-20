import shared from '../../shared.module.css';
import styles from '../page.module.css';

export function getRole(user: { IsOwner: boolean; IsAdmin: boolean }): {
  label: string;
  className: string;
} {
  if (user.IsOwner) {
    return { label: 'Owner', className: `${shared['admin__badge']} ${styles['page__badge--owner']}` };
  }

  if (user.IsAdmin) {
    return { label: 'Admin', className: `${shared['admin__badge']} ${styles['page__badge--admin']}` };
  }

  return { label: 'User', className: `${shared['admin__badge']} ${styles['page__badge--user']}` };
}
