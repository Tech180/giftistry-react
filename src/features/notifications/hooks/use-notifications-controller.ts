import { useState, useCallback, useEffect } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { Notification } from '../interfaces/notification.interface';
import { useUserSocket } from 'app/providers/user-socket-context';

export const useNotificationsController = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addEventListener, removeEventListener } = useUserSocket();

  useEffect(() => {
    const handleNewNotification = (data: any) => {
      if (data && data.Notification) {
        setNotifications((prev) => {
          if (prev.some((n) => n.Id === data.Notification.Id)) return prev;
          return [data.Notification, ...prev];
        });
      }
    };

    addEventListener('notification.received', handleNewNotification);
    return () => {
      removeEventListener('notification.received', handleNewNotification);
    };
  }, [addEventListener, removeEventListener]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationsApi.listNotifications();
      setNotifications(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationsApi.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.Id === notificationId ? { ...n, IsRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
  }, []);

  const clearAll = useCallback(async () => {
    await notificationsApi.clearAll();
    setNotifications([]);
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    await notificationsApi.deleteNotification(notificationId);
    setNotifications((prev) => prev.filter((n) => n.Id !== notificationId));
  }, []);

  const unreadCount = notifications.filter((n) => !n.IsRead).length;

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
  };
};
