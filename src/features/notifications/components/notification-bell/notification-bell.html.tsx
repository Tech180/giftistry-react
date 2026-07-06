import React from 'react';
import { Bell, Check, Layers, Trash2 } from 'lucide-react';
import { EnterPanel } from 'shared/ui';
import { NotificationBellTemplateProps } from './interfaces/notification-bell-template-props.interface';
import styles from './notification-bell.module.css';

import { Notification } from '../../interfaces/notification.interface';
import { getNotificationNavigationTarget } from '../../utils/get-notification-navigation-target';

export const NotificationBellTemplate: React.FC<NotificationBellTemplateProps> = ({
  unreadCount,
  isOpen,
  setIsOpen,
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onNavigate,
  bellRef,
  formatTime,
}) => {
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.IsRead) {
      onMarkAsRead(notification.Id);
    }

    const target = getNotificationNavigationTarget(notification);
    if (target) {
      onNavigate(target);
      setIsOpen(false);
    }
  };

  const handleDeleteNotification = (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string
  ) => {
    event.stopPropagation();
    onDeleteNotification(notificationId);
  };

  return (
    <div className={styles.container} ref={bellRef}>
      <button
        type="button"
        className={styles['bell-btn']}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <EnterPanel animation="dropdown" className={styles.dropdown}>
          <div className={styles['dropdown-header']}>
            <span className={styles['dropdown-title']}>Notifications</span>
            {notifications.length > 0 && (
              <div className={styles['header-actions']}>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className={styles['header-action-btn']}
                    onClick={onMarkAllAsRead}
                    title="Mark all read"
                  >
                    <Check size={14} />
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  className={styles['header-icon-btn']}
                  onClick={onClearAll}
                  aria-label="Clear all notifications"
                  title="Clear all"
                >
                  <Layers size={14} />
                </button>
              </div>
            )}
          </div>

          <div className={styles['dropdown-body']}>
            {isLoading ? (
              <p className={styles['status-text']}>Loading...</p>
            ) : notifications.length === 0 ? (
              <p className={styles['status-text']}>No notifications yet.</p>
            ) : (
              <ul className={styles.list}>
                {notifications.map((notification) => (
                  <li key={notification.Id} className={styles['notification-row']}>
                    <button
                      type="button"
                      className={`${styles['notification-item']} ${!notification.IsRead ? styles.unread : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={styles['notification-title']}>{notification.Title}</div>
                      <div className={styles['notification-message']}>{notification.Message}</div>
                      <div className={styles['notification-time']}>{formatTime(notification.CreatedAt)}</div>
                    </button>
                    <button
                      type="button"
                      className={styles['notification-delete-btn']}
                      onClick={(event) => handleDeleteNotification(event, notification.Id)}
                      aria-label="Delete notification"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </EnterPanel>
      )}
    </div>
  );
};
