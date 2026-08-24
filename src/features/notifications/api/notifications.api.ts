import { apiClient } from 'core/api/client';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { PublicLinkPreview } from 'features/wishlists/interfaces/public-link-preview.interface';
import {
  NotificationPreferences,
  PushSubscription,
  PushTransport,
} from '../interfaces/notification.interface';
import { mapNotification, type NotificationPayload } from '../utils/map-notification.util';

type ApiNotificationPreferences = {
  EmailAlerts?: boolean;
  Marketing?: boolean;
  FriendRequests?: boolean;
  ListShares?: boolean;
  ItemClaims?: boolean;
  Comments?: boolean;
  JobCompletions?: boolean;
  PushAlerts?: boolean;
};

export type RegisterPushPayload = {
  Platform: PushSubscription['Platform'];
  Transport: PushTransport;
  Endpoint?: string;
  Keys?: {
    P256dh?: string;
    Auth?: string;
  };
  IsPrimary?: boolean;
};

export type RegisterPushResult =
  | {
      SubscriptionId: string;
      Topic: string;
      AccessToken: string;
    }
  | PushSubscription;

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

export function mapPreferencesToApi(preferences: Partial<NotificationPreferences>): ApiNotificationPreferences {
  const body: ApiNotificationPreferences = {};
  if (preferences.EmailAlerts !== undefined) body.EmailAlerts = preferences.EmailAlerts;
  if (preferences.MarketingPromos !== undefined) body.Marketing = preferences.MarketingPromos;
  if (preferences.FriendRequests !== undefined) body.FriendRequests = preferences.FriendRequests;
  if (preferences.ListShares !== undefined) body.ListShares = preferences.ListShares;
  if (preferences.ItemClaims !== undefined) body.ItemClaims = preferences.ItemClaims;
  if (preferences.Comments !== undefined) body.Comments = preferences.Comments;
  if (preferences.JobCompletions !== undefined) body.JobCompletions = preferences.JobCompletions;
  if (preferences.PushAlerts !== undefined) body.PushAlerts = preferences.PushAlerts;
  return body;
}

export const notificationsApi = {
  listNotifications: async () => {
    const result = await apiClient.get<NotificationPayload[]>('/api/notifications');
    return (result || []).map(mapNotification);
  },

  markAsRead: (notificationId: string) =>
    apiClient.patch<Record<string, never>>(`/api/notifications/${notificationId}/read`, {}),

  markAllAsRead: () =>
    apiClient.post<Record<string, never>>('/api/notifications/read-all', {}),

  clearAll: () =>
    apiClient.delete<Record<string, never>>('/api/notifications'),

  deleteNotification: (notificationId: string) =>
    apiClient.delete<Record<string, never>>(`/api/notifications/${notificationId}`),

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

  registerPush: (payload: RegisterPushPayload) =>
    apiClient.post<RegisterPushResult>('/api/notifications/push/register', payload, 'Push'),

  listPushSubscriptions: () =>
    apiClient.get<PushSubscription[]>('/api/notifications/push/subscriptions'),

  deletePushSubscription: (subscriptionId: string) =>
    apiClient.delete<Record<string, never>>(`/api/notifications/push/register/${subscriptionId}`),

  setPrimaryPushSubscription: (subscriptionId: string) =>
    apiClient.put<PushSubscription>(
      `/api/notifications/push/register/${subscriptionId}/primary`,
      {}
    ),

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

  getPublicLinkPreview: (token: string) =>
    apiClient.get<PublicLinkPreview>(`/api/invites/link/${token}/preview`),

  postPublicLinkPreview: (token: string, password: string) =>
    apiClient.post<PublicLinkPreview>(
      `/api/invites/link/${token}/preview`,
      { Password: password },
      'Invites'
    ),
};
