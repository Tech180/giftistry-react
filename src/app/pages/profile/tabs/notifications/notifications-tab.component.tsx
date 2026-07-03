import React, { useState } from 'react';
import { NotificationsTabTemplate } from './notifications-tab.html';
import { NotificationsTabProps } from './interfaces/notifications-tab-props.interface';

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ showToast }) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [marketingPromos, setMarketingPromos] = useState(false);

  const handleToggleEmail = (checked: boolean) => {
    setEmailAlerts(checked);
    showToast(
      checked ? 'Email alerts enabled successfully.' : 'Email alerts disabled.',
      checked ? 'success' : 'info'
    );
  };

  const handleToggleMarketing = (checked: boolean) => {
    setMarketingPromos(checked);
    showToast(
      checked ? 'Subscribed to marketing and promos!' : 'Unsubscribed from marketing and promos.',
      checked ? 'success' : 'info'
    );
  };

  return (
    <NotificationsTabTemplate
      emailAlerts={emailAlerts}
      marketingPromos={marketingPromos}
      handleToggleEmail={handleToggleEmail}
      handleToggleMarketing={handleToggleMarketing}
    />
  );
};
export default NotificationsTab;
