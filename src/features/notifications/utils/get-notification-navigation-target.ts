import { Notification } from '../interfaces/notification.interface';

export function getNotificationNavigationTarget(notification: Notification): string | null {
  const meta = notification.Metadata ?? {};

  switch (notification.Type) {
    case 'friend_request':
      if (meta.requestId) {
        return `/friends/requests?highlightRequest=${encodeURIComponent(meta.requestId)}`;
      }
      return '/friends/requests';

    case 'friend_accepted':
      if (meta.userId) {
        return `/friends/current?highlightUser=${encodeURIComponent(meta.userId)}`;
      }
      return '/friends/current';

    case 'list_share':
    case 'list_shared':
    case 'list_invite':
    case 'invite_accepted':
    case 'item_claimed':
    case 'comment':
      if (meta.listId) {
        return `/wishlists/${meta.listId}`;
      }
      break;

    case 'system':
    default:
      break;
  }

  if (meta.listId) {
    return `/wishlists/${meta.listId}`;
  }

  return null;
}
