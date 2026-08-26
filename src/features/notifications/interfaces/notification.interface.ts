export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'list_share'
  | 'list_shared'
  | 'list_invite'
  | 'invite_accepted'
  | 'item_claimed'
  | 'item_deleted'
  | 'comment'
  | 'job_completed'
  | 'job_failed'
  | 'system';

export interface Notification {
  Id: string;
  UserId: string;
  Type: NotificationType;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  Metadata?: Record<string, string>;
}

export interface NotificationPreferences {
  EmailAlerts: boolean;
  MarketingPromos: boolean;
  FriendRequests: boolean;
  ListShares: boolean;
  ItemClaims: boolean;
  Comments: boolean;
  JobCompletions: boolean;
  PushAlerts: boolean;
}

export type PushTransport = 'ntfy' | 'webpush' | 'fcm';

export interface PushSubscription {
  Id: string;
  Platform: 'ios' | 'android';
  Transport: PushTransport;
  IsPrimary: boolean;
  CreatedAt: string;
  LastSeenAt?: string;
}
