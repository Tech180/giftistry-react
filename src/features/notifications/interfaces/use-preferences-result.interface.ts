import type { NotificationPreferences } from './notification-preferences.interface';

export interface Result {
  preferences: NotificationPreferences;
  isLoading: boolean;
  isSaving: boolean;
  onToggle: (key: keyof NotificationPreferences, checked: boolean) => void;
}
