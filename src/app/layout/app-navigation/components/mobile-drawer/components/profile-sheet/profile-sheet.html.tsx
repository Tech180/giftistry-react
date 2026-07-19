import React from 'react';
import { ChevronUp } from 'lucide-react';
import { ProfileTheming } from '../profile-theming/profile-theming.component';
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
    className={`${styles['profile-sheet']}${isProfileMenuOpen ? ` ${styles['profile-sheet-open']}` : ''}`}
  >
    <div className={styles['profile-sheet-actions']} aria-hidden={!isProfileMenuOpen}>
      <div className={styles['profile-sheet-actions-inner']}>
        <ProfileTheming
          theme={theme}
          appearance={appearance}
          setTheme={setTheme}
          setAppearance={setAppearance}
          isThemeUnlocked={isThemeUnlocked}
          interactive={isProfileMenuOpen}
          isActive={isActive}
        />

        <div className={styles['profile-sheet-actions-row']}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                tabIndex={isProfileMenuOpen ? 0 : -1}
                className={`${styles['profile-sheet-action']}${action.danger ? ` ${styles['profile-sheet-action-danger']}` : ''}`}
                style={{ '--action-index': index } as React.CSSProperties}
                onClick={action.onSelect}
              >
                <span className={styles['profile-sheet-action-icon']}>
                  <Icon size={18} />
                </span>
                <span className={styles['profile-sheet-action-label']}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    <button
      type="button"
      className={styles['profile-card-btn']}
      onClick={onToggleProfileMenu}
      aria-expanded={isProfileMenuOpen}
      aria-haspopup="menu"
    >
      <div className={styles['profile-card-left']}>
        <div className={styles['profile-avatar-container']}>
          <div className={styles['profile-avatar']} style={avatarStyle}>
            {showAvatarInitials && avatarInitial}
          </div>
          <div className={styles['profile-online-badge']} />
        </div>
        <div className={styles['profile-details']}>
          <div className={styles['profile-name']}>
            {user.FirstName} {user.LastName}
          </div>
          <div className={styles['profile-plan']}>@{user.Username}</div>
        </div>
      </div>
      <div className={styles['profile-chevron-btn']}>
        <ChevronUp size={14} />
      </div>
    </button>
  </div>
);
