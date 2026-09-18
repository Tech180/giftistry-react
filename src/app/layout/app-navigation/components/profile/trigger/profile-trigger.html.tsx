import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ProfileMenu } from '../menu/profile-menu.component';
import type { ProfileTriggerTemplateProps } from './interfaces/profile-trigger-template-props.interface';
import styles from './profile-trigger.module.css';

export const ProfileTriggerTemplate: React.FC<ProfileTriggerTemplateProps> = ({
  user,
  profileRef,
  isProfileOpen,
  onToggleProfile,
  avatarStyle,
  avatarInitial,
  showAvatarInitials,
  onSettings,
  onFriends,
  onLogout,
}) => (
  <div className={styles['dropdown-container']} ref={profileRef}>
    <button
      type="button"
      className={styles['profile-trigger']}
      onClick={onToggleProfile}
    >
      <div className={styles.avatar} style={avatarStyle}>
        {showAvatarInitials && avatarInitial}
      </div>
      <ChevronDown size={14} className={styles.chevron} />
    </button>

    {isProfileOpen && (
      <ProfileMenu
        user={user}
        onSettings={onSettings}
        onFriends={onFriends}
        onLogout={onLogout}
      />
    )}
  </div>
);
