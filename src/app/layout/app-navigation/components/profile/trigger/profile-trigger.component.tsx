import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarStyle, shouldShowAvatarInitials } from 'shared/utils/avatar.util';
import type { ProfileTriggerProps } from './interfaces/profile-trigger-props.interface';
import { ProfileTriggerTemplate } from './profile-trigger.html';

export const ProfileTrigger: React.FC<ProfileTriggerProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current?.contains(e.target as Node) === false) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeProfile = () => setIsProfileOpen(false);
  const avatarStyle = getAvatarStyle(user.Avatar);
  const avatarInitial = (user.FirstName?.[0] ?? user.Username[0]).toUpperCase();
  const showAvatarInitials = shouldShowAvatarInitials(user.Avatar);

  return (
    <ProfileTriggerTemplate
      user={user}
      profileRef={profileRef}
      isProfileOpen={isProfileOpen}
      onToggleProfile={() => setIsProfileOpen(!isProfileOpen)}
      avatarStyle={avatarStyle}
      avatarInitial={avatarInitial}
      showAvatarInitials={showAvatarInitials}
      onSettings={() => {
        closeProfile();
        navigate('/settings/account');
      }}
      onFriends={() => {
        closeProfile();
        navigate('/friends/current');
      }}
      onLogout={() => {
        closeProfile();
        onLogout();
      }}
    />
  );
};
