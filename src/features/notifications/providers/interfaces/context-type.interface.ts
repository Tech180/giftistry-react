import type { Notification } from '../../interfaces/notification.interface';

export interface ContextType {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}
