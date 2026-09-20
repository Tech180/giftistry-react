import type { RefObject } from 'react';
import type { Notification } from '../../../interfaces/notification.interface';

export interface BellRow {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  isUnread: boolean;
  itemClassName: string;
}

export interface TemplateProps {
  unreadBadgeLabel: string | null;
  isOpen: boolean;
  isLoading: boolean;
  hasNotifications: boolean;
  showMarkAllRead: boolean;
  rows: BellRow[];
  onToggle: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onItemClick: (id: string) => void;
  onDelete: (id: string) => void;
  bellRef: RefObject<HTMLDivElement | null>;
  rootClassName: string;
  btnClassName: string;
  badgeClassName: string;
  dropdownClassName: string;
  dropdownHeaderClassName: string;
  dropdownTitleClassName: string;
  headerActionsClassName: string;
  headerActionBtnClassName: string;
  headerIconBtnClassName: string;
  dropdownBodyClassName: string;
  statusTextClassName: string;
  listClassName: string;
  rowClassName: string;
  titleClassName: string;
  messageClassName: string;
  timeClassName: string;
  deleteBtnClassName: string;
}
