import { Notification } from '../interfaces/notification.interface';

export function getNotificationNavigationTarget(notification: Notification): string | null {
  const meta = notification.Metadata ?? {};

  switch (notification.Type) {
    case 'friend_request':
      if (meta.RequestId) {
        return `/friends/requests?highlightRequest=${encodeURIComponent(meta.RequestId)}`;
      }
      return '/friends/requests';

    case 'friend_accepted':
      if (meta.UserId) {
        return `/friends/current?highlightUser=${encodeURIComponent(meta.UserId)}`;
      }
      return '/friends/current';

    case 'list_share':
    case 'list_shared':
    case 'list_invite':
    case 'invite_accepted':
    case 'item_claimed':
    case 'item_deleted':
    case 'comment':
    case 'job_completed':
    case 'job_failed':
      if (meta.ListId) {
        return `/wishlists/${meta.ListId}`;
      }
      break;

    case 'system':
    default:
      break;
  }

  if (meta.ListId) {
    return `/wishlists/${meta.ListId}`;
  }

  return null;
}
