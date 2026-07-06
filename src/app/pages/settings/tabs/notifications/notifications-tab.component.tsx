import React, { useEffect, useState } from 'react';
import { notificationsApi, NotificationPreferences } from 'features/notifications';
import { NotificationsTabTemplate } from './notifications-tab.html';
import { NotificationsTabProps } from './interfaces/notifications-tab-props.interface';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  EmailAlerts: true,
  MarketingPromos: false,
  FriendRequests: true,
  ListShares: true,
  ItemClaims: true,
  Comments: true,
};

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ showToast }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const result = await notificationsApi.getPreferences();
        setPreferences({ ...DEFAULT_PREFERENCES, ...result });
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to load notification preferences.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, [showToast]);

  const handleToggle = async (key: keyof NotificationPreferences, checked: boolean) => {
    const prev = preferences;
    const updated = { ...preferences, [key]: checked };
    setPreferences(updated);
    setIsSaving(true);
    try {
      await notificationsApi.updatePreferences({ [key]: checked });
      showToast('Notification preferences saved.', 'success');
    } catch (err) {
      setPreferences(prev);
      showToast(
        err instanceof Error ? err.message : 'Failed to save preferences.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <NotificationsTabTemplate
      preferences={preferences}
      isLoading={isLoading}
      isSaving={isSaving}
      onToggle={handleToggle}
    />
  );
};
export default NotificationsTab;
