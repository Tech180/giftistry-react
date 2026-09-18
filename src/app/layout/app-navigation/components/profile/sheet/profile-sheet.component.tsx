import React, { useEffect, useState } from 'react';
import { getAvatarStyle, shouldShowAvatarInitials } from 'shared/utils/avatar.util';
import { PROFILE_MENU_ACTIONS } from '../constants/profile-menu-actions.constant';
import { ProfileSheetProps } from './interfaces/profile-sheet-props.interface';
import { ProfileSheetActionView } from './interfaces/profile-sheet-template-props.interface';
import { ProfileSheetTemplate } from './profile-sheet.html';

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  user,
  isActive,
  onClose,
  navigate,
  handleLogout,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const avatarStyle = getAvatarStyle(user.Avatar);
  const avatarInitial = (user.FirstName?.[0] ?? user.Username[0]).toUpperCase();

  useEffect(() => {
    if (!isActive) setIsProfileMenuOpen(false);
  }, [isActive]);

  const closeAll = () => {
    setIsProfileMenuOpen(false);
    onClose();
  };

  const actions: ProfileSheetActionView[] = PROFILE_MENU_ACTIONS.map((action) => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    onSelect: () => {
      closeAll();
      if (action.path) navigate(action.path);
      else handleLogout();
    },
  }));

  return (
    <ProfileSheetTemplate
      user={user}
      isActive={isActive}
      isProfileMenuOpen={isProfileMenuOpen}
      avatarStyle={avatarStyle}
      avatarInitial={avatarInitial}
      showAvatarInitials={shouldShowAvatarInitials(user.Avatar)}
      actions={actions}
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      isThemeUnlocked={isThemeUnlocked}
      onToggleProfileMenu={() => setIsProfileMenuOpen((open) => !open)}
    />
  );
};
