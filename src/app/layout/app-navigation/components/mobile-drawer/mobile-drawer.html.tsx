import React from 'react';
import { Link } from 'react-router-dom';
import { X, LayoutGrid, ListVideo } from 'lucide-react';
import { BrandMark } from 'shared/ui/brand-mark/brand-mark.component';
import { IconButton } from 'shared/ui/icon-button/icon-button.component';
import { ProfileSheet } from './components/profile-sheet/profile-sheet.component';
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
  isActive,
  showSwipeHandle,
  isDashboardActive,
  brandTo,
  overlayRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  overlayClassName,
  drawerClassName,
}) => (
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
          <span className={styles['drawer-section-title']}>Navigation</span>
          <div className={styles['nav-island']}>
            <Link
              to="/dashboard"
              className={`${styles['drawer-link']} ${isDashboardActive ? styles['active-link'] : ''}`}
              onClick={onClose}
            >
              <div className={styles['drawer-link-left']}>
                <LayoutGrid size={18} className={styles['drawer-icon']} />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className={styles['drawer-link']}
              onClick={onClose}
            >
              <div className={styles['drawer-link-left']}>
                <ListVideo size={18} className={styles['drawer-icon']} />
                <span>My Wishlists</span>
              </div>
            </Link>
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
            <Link
              to="/register"
              className={styles['drawer-auth-btn-primary']}
              onClick={onClose}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);
