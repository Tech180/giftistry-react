import { Notification } from '../../../interfaces/notification.interface';

export interface NotificationBellTemplateProps {
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigate: (path: string) => void;
  bellRef: React.RefObject<HTMLDivElement | null>;
  formatTime: (dateStr: string) => string;
}
