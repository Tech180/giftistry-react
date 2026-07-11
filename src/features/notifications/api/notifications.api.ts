import { apiClient } from 'core/api/client';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { Notification, NotificationPreferences } from '../interfaces/notification.interface';

type ApiNotification = {
  Id: string;
  UserId: string;
  Type: Notification['Type'];
  Title: string;
  Body?: string;
  Message?: string;
  ReadAt?: string | null;
  IsRead?: boolean;
  CreatedAt: string;
  Metadata?: Record<string, string>;
};

type ApiNotificationPreferences = {
  EmailAlerts?: boolean;
  Marketing?: boolean;
  FriendRequests?: boolean;
  ListShares?: boolean;
  ItemClaims?: boolean;
  Comments?: boolean;
};

function mapPreferencesFromApi(api: ApiNotificationPreferences): NotificationPreferences {
  return {
    EmailAlerts: api.EmailAlerts ?? true,
    MarketingPromos: api.Marketing ?? false,
    FriendRequests: api.FriendRequests ?? true,
    ListShares: api.ListShares ?? true,
    ItemClaims: api.ItemClaims ?? true,
    Comments: api.Comments ?? true,
  };
}

function mapPreferencesToApi(preferences: Partial<NotificationPreferences>): ApiNotificationPreferences {
  const body: ApiNotificationPreferences = {};
  if (preferences.EmailAlerts !== undefined) body.EmailAlerts = preferences.EmailAlerts;
  if (preferences.MarketingPromos !== undefined) body.Marketing = preferences.MarketingPromos;
  if (preferences.FriendRequests !== undefined) body.FriendRequests = preferences.FriendRequests;
  if (preferences.ListShares !== undefined) body.ListShares = preferences.ListShares;
  if (preferences.ItemClaims !== undefined) body.ItemClaims = preferences.ItemClaims;
  if (preferences.Comments !== undefined) body.Comments = preferences.Comments;
  return body;
}

function mapNotification(notification: ApiNotification): Notification {
  return {
    Id: notification.Id,
    UserId: notification.UserId,
    Type: notification.Type,
    Title: notification.Title,
    Message: notification.Message ?? notification.Body ?? '',
    IsRead: notification.IsRead ?? !!notification.ReadAt,
    CreatedAt: notification.CreatedAt,
    Metadata: notification.Metadata,
  };
}

export const notificationsApi = {
  listNotifications: async () => {
    const result = await apiClient.get<ApiNotification[]>('/api/notifications');
    return (result || []).map(mapNotification);
  },

  markAsRead: (notificationId: string) =>
    apiClient.patch<{ success: boolean }>(`/api/notifications/${notificationId}/read`, {}),

  markAllAsRead: () =>
    apiClient.post<{ success: boolean }>('/api/notifications/read-all', {}),

  clearAll: () =>
    apiClient.delete<{ success: boolean }>('/api/notifications'),

  deleteNotification: (notificationId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/notifications/${notificationId}`),

  getPreferences: async () => {
    const result = await apiClient.get<ApiNotificationPreferences>('/api/notifications/preferences');
    return mapPreferencesFromApi(result ?? {});
  },

  updatePreferences: (preferences: Partial<NotificationPreferences>) =>
    apiClient.patch<ApiNotificationPreferences>(
      '/api/notifications/preferences',
      mapPreferencesToApi(preferences),
      'Notifications'
    ).then(mapPreferencesFromApi),

  acceptListInvite: (token: string, password?: string) =>
    apiClient.post<ListShare>(
      `/api/invites/link/${token}/accept`,
      password ? { Password: password } : {},
      password ? 'Invites' : undefined
    ),

  getInviteLinkDetails: (token: string) =>
    apiClient.get<{ ListId: string; Role: string; PasswordProtected: boolean; ExpiresAt: string | null }>(
      `/api/invites/link/${token}`
    ),
};
