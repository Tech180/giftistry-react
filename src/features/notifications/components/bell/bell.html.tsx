import React from 'react';
import { Bell as BellIcon, Check, Layers, Trash2 } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import { EnterPanel } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const BellTemplate: React.FC<TemplateProps> = ({
  unreadBadgeLabel,
  isOpen,
  isLoading,
  hasNotifications,
  showMarkAllRead,
  rows,
  onToggle,
  onMarkAllAsRead,
  onClearAll,
  onItemClick,
  onDelete,
  bellRef,
  rootClassName,
  btnClassName,
  badgeClassName,
  dropdownClassName,
  dropdownHeaderClassName,
  dropdownTitleClassName,
  headerActionsClassName,
  headerActionBtnClassName,
  headerIconBtnClassName,
  dropdownBodyClassName,
  statusTextClassName,
  listClassName,
  rowClassName,
  titleClassName,
  messageClassName,
  timeClassName,
  deleteBtnClassName,
}) => {
  return (
    <div className={rootClassName} ref={bellRef}>
      <button
        type="button"
        className={btnClassName}
        onClick={onToggle}
        aria-label="Notifications"
        title="Notifications"
        data-tour={TOUR_TARGETS.notificationBell}
      >
        <BellIcon size={18} />
        {unreadBadgeLabel ? <span className={badgeClassName}>{unreadBadgeLabel}</span> : null}
      </button>

      {isOpen ? (
        <EnterPanel
          animation = {
            'dropdown'
          }
          className = {
            dropdownClassName
          }
        >
          <div className={dropdownHeaderClassName}>
            <span className={dropdownTitleClassName}>Notifications</span>
            {hasNotifications ? (
              <div className={headerActionsClassName}>
                {showMarkAllRead ? (
                  <button
                    type="button"
                    className={headerActionBtnClassName}
                    onClick={onMarkAllAsRead}
                    title="Mark all read"
                  >
                    <Check size={14} />
                    Mark all read
                  </button>
                ) : null}
                <button
                  type="button"
                  className={headerIconBtnClassName}
                  onClick={onClearAll}
                  aria-label="Clear all notifications"
                  title="Clear all"
                >
                  <Layers size={14} />
                </button>
              </div>
            ) : null}
          </div>

          <div className={dropdownBodyClassName}>
            {isLoading ? (
              <p className={statusTextClassName}>Loading...</p>
            ) : !hasNotifications ? (
              <p className={statusTextClassName}>No notifications yet.</p>
            ) : (
              <ul className={listClassName}>
                {rows.map((row) => (
                  <li key={row.id} className={rowClassName}>
                    <button
                      type="button"
                      className={row.itemClassName}
                      onClick = {
                        () => onItemClick(row.id)
                      }
                    >
                      <div className={titleClassName}>{row.title}</div>
                      <div className={messageClassName}>{row.message}</div>
                      <div className={timeClassName}>{row.timeLabel}</div>
                    </button>
                    <button
                      type="button"
                      className={deleteBtnClassName}
                      onClick = {
                        (event) => {
                          event.stopPropagation();
                          onDelete(row.id);
                        }
                      }
                      aria-label="Delete notification"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </EnterPanel>
      ) : null}
    </div>
  );
};
