import React, { useEffect, useState } from 'react';
import { getAvatarStyle, shouldShowAvatarInitials } from 'shared/utils/avatar.util';
import { PROFILE_MENU_ACTIONS } from '../../../profile-menu/utils/profile-menu-actions';
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
  const avatarStyle: React.CSSProperties = user.Avatar
    ? getAvatarStyle(user.Avatar)
    : getAvatarStyle(null);

  useEffect(() => {
    if (!isActive) {
      setIsProfileMenuOpen(false);
    }
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
      if (action.id === 'settings') {
        closeAll();
        navigate('/settings/account');
      } else if (action.id === 'friends') {
        closeAll();
        navigate('/friends/current');
      } else {
        closeAll();
        handleLogout();
      }
    },
  }));

  const avatarInitial = user.FirstName
    ? user.FirstName[0].toUpperCase()
    : user.Username[0].toUpperCase();

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
