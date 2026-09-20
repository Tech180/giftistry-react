import { useEffect, useState } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { DEFAULT_PREFERENCES } from '../constants/default-preferences.constant';
import type { NotificationPreferences } from '../interfaces/notification-preferences.interface';
import type { Props } from '../interfaces/use-preferences-props.interface';
import type { Result } from '../interfaces/use-preferences-result.interface';

export function usePreferences({ showToast }: Props): Result {
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
          'error',
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, [showToast]);

  const onToggle = async (key: keyof NotificationPreferences, checked: boolean) => {
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
        'error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    onToggle,
  };
}
