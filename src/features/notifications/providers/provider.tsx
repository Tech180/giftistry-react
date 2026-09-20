import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from 'features/auth';
import { useUserSocket } from 'shared/providers/user-socket';
import { notificationsApi } from '../api/notifications.api';
import type { Notification } from '../interfaces/notification.interface';
import type { NotificationSocketPayload } from '../interfaces/notification-socket-payload.interface';
import { mapNotification } from '../utils/map-notification.util';
import { NotificationsContext } from './context';
import type { Props } from './interfaces/props.interface';

export function NotificationsProvider({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const { isConnected, addEventListener, removeEventListener } = useUserSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wasConnectedRef = useRef(false);
  const hasConnectedOnceRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

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
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setError(null);
      wasConnectedRef.current = false;
      hasConnectedOnceRef.current = false;
      return;
    }

    void fetchNotifications();
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (isConnected && !wasConnectedRef.current) {
      // Auth effect already loads on login; only refetch after a later reconnect.
      if (hasConnectedOnceRef.current) {
        void fetchNotifications();
      }
      hasConnectedOnceRef.current = true;
    }
    wasConnectedRef.current = isConnected;
  }, [isAuthenticated, isConnected, fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = (data: unknown) => {
      if (!data || typeof data !== 'object') {
        return;
      }

      const notificationPayload = (data as NotificationSocketPayload).Notification;
      if (!notificationPayload) {
        return;
      }

      const mapped = mapNotification(notificationPayload);
      setNotifications((prev) => {
        if (prev.some((n) => n.Id === mapped.Id)) {
          return prev;
        }

        return [mapped, ...prev];
      });
    };

    addEventListener('notification.received', handleNewNotification);
    return () => {
      removeEventListener('notification.received', handleNewNotification);
    };
  }, [addEventListener, removeEventListener]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationsApi.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.Id === notificationId ? { ...n, IsRead: true } : n)),
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

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.IsRead).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      isLoading,
      error,
      unreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification,
    }),
    [
      notifications,
      isLoading,
      error,
      unreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification,
    ],
  );

  return (
    <NotificationsContext.Provider
      value = {
        value
      }
    >
      {children}
    </NotificationsContext.Provider>
  );
}
