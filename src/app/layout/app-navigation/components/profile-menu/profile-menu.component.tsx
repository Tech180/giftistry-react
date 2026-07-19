import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { ProfileMenuProps } from './interfaces/profile-menu-props.interface';
import { PROFILE_MENU_ACTIONS } from './utils/profile-menu-actions';
import styles from './profile-menu.module.css';

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onSettings,
  onFriends,
  onLogout,
  placement = 'down',
  className,
}) => {
  const placementClass =
    placement === 'up' ? styles['placement-up'] : styles['placement-down'];

  const handleAction = (id: (typeof PROFILE_MENU_ACTIONS)[number]['id']) => {
    if (id === 'settings') onSettings();
    else if (id === 'friends') onFriends();
    else onLogout();
  };

  return (
    <EnterPanel
      animation="dropdown"
      className={`${styles.menu} ${placementClass}${className ? ` ${className}` : ''}`}
    >
      <div className={styles['user-info']}>
        <div className={styles['user-name']}>
          {user.FirstName} {user.LastName}
        </div>
        <div className={styles['user-email']}>@{user.Username}</div>
      </div>

      <div className={styles['menu-divider']} />

      {PROFILE_MENU_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            className={`${styles['menu-item']}${action.danger ? ` ${styles['danger-item']}` : ''}`}
            onClick={() => handleAction(action.id)}
          >
            <Icon size={14} className={styles['item-icon']} />
            {action.label}
          </button>
        );
      })}
    </EnterPanel>
  );
};
