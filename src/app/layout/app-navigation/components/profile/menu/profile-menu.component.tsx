import React from 'react';
import { PROFILE_MENU_ACTIONS } from '../constants/profile-menu-actions.constant';
import type { ProfileMenuActionId } from '../interfaces/profile-menu-action-id.type';
import { ProfileMenuProps } from './interfaces/profile-menu-props.interface';
import type { ProfileMenuActionView } from './interfaces/profile-menu-template-props.interface';
import { ProfileMenuTemplate } from './profile-menu.html';
import styles from './profile-menu.module.css';

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onSettings,
  onFriends,
  onLogout,
  placement = 'down',
  className,
}) => {
  const placementClass = placement === 'up' ? styles['placement-up'] : styles['placement-down'];
  const handlers: Record<ProfileMenuActionId, () => void> = {
    settings: onSettings,
    friends: onFriends,
    logout: onLogout,
  };

  const actions: ProfileMenuActionView[] = PROFILE_MENU_ACTIONS.map((action) => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    onSelect: () => handlers[action.id](),
  }));

  return (
    <ProfileMenuTemplate
      user={user}
      menuClassName={`${styles.menu} ${placementClass}${className ? ` ${className}` : ''}`}
      actions={actions}
    />
  );
};
