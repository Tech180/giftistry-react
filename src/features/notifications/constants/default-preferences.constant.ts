import type { NotificationPreferences } from '../interfaces/notification-preferences.interface';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  EmailAlerts: true,
  MarketingPromos: false,
  FriendRequests: true,
  ListShares: true,
  ItemClaims: true,
  Comments: true,
  JobCompletions: true,
  PushAlerts: true,
};
