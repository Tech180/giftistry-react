import { NotificationPreferences } from 'features/notifications';

export interface NotificationsTabTemplateProps {
  preferences: NotificationPreferences;
  isLoading: boolean;
  isSaving: boolean;
  onToggle: (key: keyof NotificationPreferences, checked: boolean) => void;
}
