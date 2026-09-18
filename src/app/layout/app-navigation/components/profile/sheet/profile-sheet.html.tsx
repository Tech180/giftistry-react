import React from 'react';
import { ChevronUp } from 'lucide-react';
import { ProfileTheming } from '../theming/profile-theming.component';
import { ProfileSheetTemplateProps } from './interfaces/profile-sheet-template-props.interface';
import styles from './profile-sheet.module.css';

export const ProfileSheetTemplate: React.FC<ProfileSheetTemplateProps> = ({
  user,
  isActive,
  isProfileMenuOpen,
  avatarStyle,
  avatarInitial,
  showAvatarInitials,
  actions,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  onToggleProfileMenu,
}) => (
  <div
    className={`${styles['profile-sheet']}${isProfileMenuOpen ? ` ${styles['profile-sheet--open']}` : ''}`}
  >
    <div
      className={`${styles['profile-sheet__actions']}${isProfileMenuOpen ? ` ${styles['profile-sheet__actions--open']}` : ''}`}
      aria-hidden={!isProfileMenuOpen}
    >
      <div
        className={`${styles['profile-sheet__actions-inner']}${isProfileMenuOpen ? ` ${styles['profile-sheet__actions-inner--open']}` : ''}`}
      >
        <ProfileTheming
          theme={theme}
          appearance={appearance}
          setTheme={setTheme}
          setAppearance={setAppearance}
          isThemeUnlocked={isThemeUnlocked}
          interactive={isProfileMenuOpen}
          isActive={isActive}
        />

        <div className={styles['profile-sheet__actions-row']}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                tabIndex={isProfileMenuOpen ? 0 : -1}
                className={`${styles['profile-sheet__action']}${isProfileMenuOpen ? ` ${styles['profile-sheet__action--visible']}` : ''}${action.danger ? ` ${styles['profile-sheet__action--danger']}` : ''}`}
                style={{ '--action-index': index } as React.CSSProperties}
                onClick={action.onSelect}
              >
                <span
                  className={`${styles['profile-sheet__action-icon']}${action.danger ? ` ${styles['profile-sheet__action-icon--danger']}` : ''}`}
                >
                  <Icon size={18} />
                </span>
                <span className={styles['profile-sheet__action-label']}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    <button
      type="button"
      className={`${styles['profile-sheet__card-btn']}${!isProfileMenuOpen ? ` ${styles['profile-sheet__card-btn--idle']}` : ''}`}
      onClick={onToggleProfileMenu}
      aria-expanded={isProfileMenuOpen}
      aria-haspopup="menu"
    >
      <div className={styles['profile-sheet__card-left']}>
        <div className={styles['profile-sheet__avatar-wrap']}>
          <div className={styles['profile-sheet__avatar']} style={avatarStyle}>
            {showAvatarInitials && avatarInitial}
          </div>
          <div className={styles['profile-sheet__online-badge']} />
        </div>
        <div className={styles['profile-sheet__details']}>
          <div className={styles['profile-sheet__name']}>
            {user.FirstName} {user.LastName}
          </div>
          <div className={styles['profile-sheet__plan']}>@{user.Username}</div>
        </div>
      </div>
      <div
        className={`${styles['profile-sheet__chevron']}${isProfileMenuOpen ? ` ${styles['profile-sheet__chevron--open']}` : ''}`}
      >
        <ChevronUp size={14} />
      </div>
    </button>
  </div>
);
