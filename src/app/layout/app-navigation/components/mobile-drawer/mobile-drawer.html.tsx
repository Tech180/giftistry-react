import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import { PRIMARY_NAV_LINK_ICONS } from '../../constants/primary-nav-link-icons.constant';
import { PRIMARY_NAV_LINKS } from '../../constants/primary-nav-links.constant';
import { BrandMark } from 'shared/ui/brand-mark/brand-mark.component';
import { IconButton } from 'shared/ui/icon-button/icon-button.component';
import { ProfileSheet } from '../profile/sheet/profile-sheet.component';
import { MobileDrawerTemplateProps } from './interfaces/mobile-drawer-template-props.interface';
import styles from './mobile-drawer.module.css';

export const MobileDrawerTemplate: React.FC<MobileDrawerTemplateProps> = ({
  onClose,
  user,
  isAuthenticated,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  handleLogout,
  navigate,
  drawerRef,
  showRegisterCta,
  isActive,
  showSwipeHandle,
  isDashboardActive,
  isFriendsActive,
  brandTo,
  overlayRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  overlayClassName,
  drawerClassName,
}) => {
  const navActiveById = {
    dashboard: isDashboardActive,
    friends: isFriendsActive,
  } as const;

  return (
  <div
    ref={overlayRef}
    className={overlayClassName}
    aria-hidden={!isActive}
  >
    <div
      className={styles['drawer-close-area']}
      onClick={onClose}
      aria-hidden
    />

    <div
      ref={drawerRef}
      className={drawerClassName}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`${styles['swipe-handle']} ${showSwipeHandle ? styles['swipe-handle-visible'] : ''}`}
        aria-hidden
      />

      <div className={`${styles['drawer-header']} ${styles['stagger-item']} ${styles['delay-1']}`}>
        <div className={styles['brand-link']} onClick={onClose}>
          <BrandMark to={brandTo} />
        </div>

        <IconButton
          icon={<X size={20} />}
          ariaLabel="Close menu"
          variant="ghost"
          size="sm"
          onClick={onClose}
        />
      </div>

      <div className={styles['drawer-content']}>
        <div className={`${styles['stagger-item']} ${styles['delay-1']}`}>
          <div className={styles['nav-island']}>
            {PRIMARY_NAV_LINKS.map((link) => {
              const Icon = PRIMARY_NAV_LINK_ICONS[link.id];
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`${styles['drawer-link']} ${navActiveById[link.id] ? styles['active-link'] : ''}`}
                  onClick={onClose}
                  {...(link.id === 'friends'
                    ? { 'data-tour': TOUR_TARGETS.friendsAction }
                    : {})}
                >
                  <div className={styles['drawer-link-left']}>
                    <Icon size={18} className={styles['drawer-icon']} />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${styles['drawer-footer']} ${styles['stagger-item']} ${styles['delay-2']}`}>
        {isAuthenticated && user ? (
          <ProfileSheet
            user={user}
            isActive={isActive}
            onClose={onClose}
            navigate={navigate}
            handleLogout={handleLogout}
            theme={theme}
            appearance={appearance}
            setTheme={setTheme}
            setAppearance={setAppearance}
            isThemeUnlocked={isThemeUnlocked}
          />
        ) : (
          <div className={styles['drawer-auth-buttons']}>
            <Link
              to="/login"
              className={styles['drawer-auth-btn-secondary']}
              onClick={onClose}
            >
              Sign In
            </Link>
            {showRegisterCta && (
              <Link
                to="/register"
                className={styles['drawer-auth-btn-primary']}
                onClick={onClose}
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};
