import React from 'react';
import { NotificationsTabTemplateProps } from './interfaces/notifications-tab-template-props.interface';
import styles from './notifications-tab.module.css';

export const NotificationsTabTemplate: React.FC<NotificationsTabTemplateProps> = ({
  emailAlerts,
  marketingPromos,
  handleToggleEmail,
  handleToggleMarketing,
}) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Notifications</h2>
        <p className={styles.pageSubtitle}>Configure how and when we contact you.</p>
      </div>

      <div className={`${styles.glassCard} ${styles.notificationCard}`}>
        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleTitle}>Email Alerts</div>
            <div className={styles.toggleDesc}>Receive updates about wishlists you follow or items updated.</div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => handleToggleEmail(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleTitle}>Marketing & Promos</div>
            <div className={styles.toggleDesc}>Occasional deals, holiday specials, and product newsletters.</div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={marketingPromos}
              onChange={(e) => handleToggleMarketing(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};
export default NotificationsTabTemplate;
