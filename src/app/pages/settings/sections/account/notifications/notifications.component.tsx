import React from 'react';
import { useNotificationPreferences } from 'features/notifications';
import { NotificationsTemplate } from './notifications.html';
import { NotificationsProps } from './interfaces/props.interface';

export const Notifications: React.FC<NotificationsProps> = ({ showToast }) => {
  const preferences = useNotificationPreferences({ showToast });
  return <NotificationsTemplate {...preferences} />;
};

export default Notifications;
