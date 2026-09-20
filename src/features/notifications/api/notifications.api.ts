import { apiClient } from 'core/api/client';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { PublicLinkPreview } from 'features/wishlists/interfaces/public-link-preview.interface';
import type { ApiNotificationPreferences } from '../interfaces/api-notification-preferences.interface';
import type { NotificationPreferences } from '../interfaces/notification-preferences.interface';
import type { NotificationPayload } from '../interfaces/notification-payload.interface';
import type { PushSubscription } from '../interfaces/push-subscription.interface';
import type { RegisterPushPayload } from '../interfaces/register-push-payload.interface';
import type { RegisterPushResult } from '../interfaces/register-push-result.type';
import { mapNotification } from '../utils/map-notification.util';
import { mapPreferencesFromApi, mapPreferencesToApi } from '../utils/map-preferences.util';

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
      'Notifications',
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
      {},
    ),

  acceptListInvite: (token: string, password?: string) =>
    apiClient.post<ListShare>(
      `/api/invites/link/${token}/accept`,
      password ? { Password: password } : {},
      password ? 'Invites' : undefined,
    ),

  getInviteLinkDetails: (token: string) =>
    apiClient.get<{ ListId: string; Role: string; PasswordProtected: boolean; ExpiresAt: string | null }>(
      `/api/invites/link/${token}`,
    ),

  getPublicLinkPreview: (token: string) =>
    apiClient.get<PublicLinkPreview>(`/api/invites/link/${token}/preview`),

  postPublicLinkPreview: (token: string, password: string) =>
    apiClient.post<PublicLinkPreview>(
      `/api/invites/link/${token}/preview`,
      { Password: password },
      'Invites',
    ),
};
