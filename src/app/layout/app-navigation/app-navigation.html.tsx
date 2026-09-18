import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NotificationBell } from 'features/notifications';
import { NavigationTemplateProps } from './interfaces/navigation-template-props.interface';
import { BrandMark } from 'shared/ui/brand-mark/brand-mark.component';
import { MobileDrawer } from './components/mobile-drawer/mobile-drawer.component';
import { ProfileTrigger } from './components/profile/trigger/profile-trigger.component';
import { ThemeMenu } from './components/theme-menu/theme-menu.component';
import { WishlistSearch } from './components/wishlist-search/wishlist-search.component';
import styles from './app-navigation.module.css';

export const AppNavigationTemplate: React.FC<NavigationTemplateProps> = ({
  user,
  isAuthenticated,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  customThemes,
  temporaryTheme,
  handleLogout,
  navigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuRef,
  hamburgerRef,
  showRegisterCta,
}) => (
  <nav className={styles.navbar}>
    <div className={styles.container}>
      <div className={styles.left}>
        <button
          ref={hamburgerRef}
          className={styles['hamburger-btn']}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
          type="button"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={styles['brand-wrapper']}>
          <BrandMark to={isAuthenticated ? '/dashboard' : '/'} />
        </div>

        {isAuthenticated && (
          <div className={styles['nav-links']}>
            <Link to="/dashboard" className={styles['nav-link']}>
              Dashboard
            </Link>
          </div>
        )}
      </div>

      {isAuthenticated && <WishlistSearch />}

      <div className={styles.right}>
        {isAuthenticated && <NotificationBell />}
        <ThemeMenu
          theme={theme}
          appearance={appearance}
          setTheme={setTheme}
          setAppearance={setAppearance}
          isThemeUnlocked={isThemeUnlocked}
          customThemes={customThemes}
          temporaryTheme={temporaryTheme}
        />

        {isAuthenticated && user ? (
          <ProfileTrigger user={user} onLogout={handleLogout} />
        ) : (
          <div className={styles['auth-buttons']}>
            <Link to="/login" className={styles['login-btn']}>
              Sign In
            </Link>
            {showRegisterCta && (
              <Link to="/register" className={styles['register-btn']}>
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </div>

    <MobileDrawer
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      user={user}
      isAuthenticated={isAuthenticated}
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      isThemeUnlocked={isThemeUnlocked}
      handleLogout={handleLogout}
      navigate={navigate}
      drawerRef={mobileMenuRef}
      showRegisterCta={showRegisterCta}
    />
  </nav>
);
