import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../providers';
import { formatTime } from '../../utils/format-time.util';
import { getNavigationTarget } from '../../utils/get-navigation-target.util';
import { BellTemplate } from './bell.html';
import type { BellRow } from './interfaces/template-props.interface';
import styles from './bell.module.css';

export const Bell: React.FC = () => {
  const navigate = useNavigate();
  const bellRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rows: BellRow[] = notifications.map((notification) => {
    const isUnread = !notification.IsRead;
    return {
      id: notification.Id,
      title: notification.Title,
      message: notification.Message,
      timeLabel: formatTime(notification.CreatedAt),
      isUnread,
      itemClassName: [
        styles.bell__item,
        isUnread ? styles['bell__item--unread'] ?? '' : '',
      ]
        .filter(Boolean)
        .join(' '),
    };
  });

  const onToggle = () => {
    setIsOpen((open) => !open);
  };

  const onItemClick = (id: string) => {
    const notification = notifications.find((item) => item.Id === id);
    if (!notification) return;
    if (!notification.IsRead) {
      markAsRead(notification.Id);
    }
    const target = getNavigationTarget(notification);
    if (target) {
      navigate(target);
      setIsOpen(false);
    }
  };

  return (
    <BellTemplate
      unreadBadgeLabel = {
        unreadCount > 0 ? (unreadCount > 9 ? '9+' : String(unreadCount)) : null
      }
      isOpen = {
        isOpen
      }
      isLoading = {
        isLoading
      }
      hasNotifications = {
        notifications.length > 0
      }
      showMarkAllRead = {
        unreadCount > 0
      }
      rows = {
        rows
      }
      onToggle = {
        onToggle
      }
      onMarkAllAsRead = {
        markAllAsRead
      }
      onClearAll = {
        clearAll
      }
      onItemClick = {
        onItemClick
      }
      onDelete = {
        deleteNotification
      }
      bellRef = {
        bellRef
      }
      rootClassName = {
        styles.bell
      }
      btnClassName = {
        styles.bell__btn
      }
      badgeClassName = {
        styles.bell__badge
      }
      dropdownClassName = {
        styles.bell__dropdown
      }
      dropdownHeaderClassName = {
        styles['bell__dropdown-header']
      }
      dropdownTitleClassName = {
        styles['bell__dropdown-title']
      }
      headerActionsClassName = {
        styles['bell__header-actions']
      }
      headerActionBtnClassName = {
        styles['bell__header-action']
      }
      headerIconBtnClassName = {
        styles['bell__header-icon']
      }
      dropdownBodyClassName = {
        styles['bell__dropdown-body']
      }
      statusTextClassName = {
        styles.bell__status
      }
      listClassName = {
        styles.bell__list
      }
      rowClassName = {
        styles.bell__row
      }
      titleClassName = {
        styles.bell__title
      }
      messageClassName = {
        styles.bell__message
      }
      timeClassName = {
        styles.bell__time
      }
      deleteBtnClassName = {
        styles.bell__delete
      }
    />
  );
};
