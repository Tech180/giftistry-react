import React from 'react';
import { EnterPanel, Switch } from 'shared/ui';
import { NotificationsTabTemplateProps } from './interfaces/notifications-tab-template-props.interface';
import styles from './notifications-tab.module.css';

const PREFERENCE_ROWS: {
  key: keyof import('features/notifications').NotificationPreferences;
  title: string;
  desc: string;
}[] = [
  {
    key: 'EmailAlerts',
    title: 'Email Alerts',
    desc: 'Receive updates about wishlists you follow or items updated.',
  },
  {
    key: 'MarketingPromos',
    title: 'Marketing & Promos',
    desc: 'Occasional deals, holiday specials, and product newsletters.',
  },
  {
    key: 'FriendRequests',
    title: 'Friend Requests',
    desc: 'Get notified when someone sends or accepts a friend request.',
  },
  {
    key: 'ListShares',
    title: 'List Shares & Invites',
    desc: 'Alerts when a wishlist is shared with you or you receive an invite.',
  },
  {
    key: 'ItemClaims',
    title: 'Item Claims',
    desc: 'Notifications when items on your wishlists are claimed.',
  },
  {
    key: 'Comments',
    title: 'Comments',
    desc: 'New comments and discussion activity on shared wishlists.',
  },
];

export const NotificationsTabTemplate: React.FC<NotificationsTabTemplateProps> = ({
  preferences,
  isLoading,
  isSaving,
  onToggle,
}) => {
  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['page-header']}>
        <h2 className={styles['page-title']}>Notifications</h2>
        <p className={styles['page-subtitle']}>Configure how and when we contact you.</p>
      </div>

      <div className={`${styles['glass-card']} ${styles['notification-card']}`}>
        {isLoading ? (
          <p className={styles['loading-text']}>Loading preferences...</p>
        ) : (
          PREFERENCE_ROWS.map((row, idx) => (
            <React.Fragment key={row.key}>
              {idx > 0 && <div className={styles.divider} />}
              <div className={styles['toggle-row']}>
                <div>
                  <div className={styles['toggle-title']}>{row.title}</div>
                  <div className={styles['toggle-desc']}>{row.desc}</div>
                </div>
                <Switch
                  checked={preferences[row.key]}
                  onChange={(checked) => onToggle(row.key, checked)}
                  disabled={isSaving}
                  aria-label={row.title}
                />
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </EnterPanel>
  );
};
export default NotificationsTabTemplate;
