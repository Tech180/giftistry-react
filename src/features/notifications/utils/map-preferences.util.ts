import type { ApiNotificationPreferences } from '../interfaces/api-notification-preferences.interface';
import type { NotificationPreferences } from '../interfaces/notification-preferences.interface';

export function mapPreferencesFromApi(api: ApiNotificationPreferences): NotificationPreferences {
  return {
    EmailAlerts: api.EmailAlerts ?? true,
    MarketingPromos: api.Marketing ?? false,
    FriendRequests: api.FriendRequests ?? true,
    ListShares: api.ListShares ?? true,
    ItemClaims: api.ItemClaims ?? true,
    Comments: api.Comments ?? true,
    JobCompletions: api.JobCompletions ?? true,
    PushAlerts: api.PushAlerts ?? true,
  };
}

export function mapPreferencesToApi(
  preferences: Partial<NotificationPreferences>,
): ApiNotificationPreferences {
  const body: ApiNotificationPreferences = {};
  if (preferences.EmailAlerts !== undefined) {
    body.EmailAlerts = preferences.EmailAlerts;
  }
  if (preferences.MarketingPromos !== undefined) {
    body.Marketing = preferences.MarketingPromos;
  }
  if (preferences.FriendRequests !== undefined) {
    body.FriendRequests = preferences.FriendRequests;
  }
  if (preferences.ListShares !== undefined) {
    body.ListShares = preferences.ListShares;
  }
  if (preferences.ItemClaims !== undefined) {
    body.ItemClaims = preferences.ItemClaims;
  }
  if (preferences.Comments !== undefined) {
    body.Comments = preferences.Comments;
  }
  if (preferences.JobCompletions !== undefined) {
    body.JobCompletions = preferences.JobCompletions;
  }
  if (preferences.PushAlerts !== undefined) {
    body.PushAlerts = preferences.PushAlerts;
  }
  return body;
}
