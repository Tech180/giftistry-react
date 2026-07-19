import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sun, Moon, Search, ChevronDown, Palette, Lock, Menu, X } from 'lucide-react';
import { NotificationBell } from 'features/notifications';
import { getAvatarStyle, shouldShowAvatarInitials } from 'shared/utils/avatar.util';
import { NavigationTemplateProps } from './interfaces/navigation-template-props.interface';
import { BrandMark } from 'shared/ui/brand-mark/brand-mark.component';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { MobileDrawer } from './components/mobile-drawer/mobile-drawer.component';
import { ProfileMenu } from './components/profile-menu/profile-menu.component';
import styles from './app-navigation.module.css';

export const AppNavigationTemplate: React.FC<NavigationTemplateProps> = ({
  user,
  isAuthenticated,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  isProfileOpen,
  setIsProfileOpen,
  isThemeOpen,
  setIsThemeOpen,
  profileRef,
  themeRef,
  handleLogout,
  standardThemes,
  holidayThemes,
  customThemes,
  temporaryTheme,
  isHolidayOpen,
  setIsHolidayOpen,
  appearances,
  navigate,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearchLoading,
  activeSearchIndex,
  setActiveSearchIndex,
  handleSearchSelect,
  searchRef,
  searchInputRef,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuRef,
  hamburgerRef,
}) => {
  const avatarStyle: React.CSSProperties = user?.Avatar ? getAvatarStyle(user.Avatar) : getAvatarStyle(null);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          {/* Hamburger Menu Button on mobile */}
          <button
            ref={hamburgerRef}
            className={styles['hamburger-btn']}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles['brand-wrapper']}>
            <BrandMark to={isAuthenticated ? '/dashboard' : '/'} />
          </div>

          {isAuthenticated && (
            <div className={styles['nav-links']}>
              <Link to="/dashboard" className={styles['nav-link']}>Dashboard</Link>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className={styles['search-container']} ref={searchRef}>
            <div className={styles['search-input-wrapper']}>
              <Search size={14} className={styles['search-icon']} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search wishlists... (⌘K)"
                className={styles['search-input']}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                  setActiveSearchIndex(0);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles['clear-search-btn']}
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
            
            {isSearchOpen && (
              <EnterPanel animation="dropdown" className={styles['search-dropdown']}>
                {isSearchLoading ? (
                  <div className={styles['dropdown-status']}>Loading wishlists...</div>
                ) : searchResults.length > 0 ? (
                  <div className={styles['dropdown-list']}>
                    {searchResults.map((wishlist, idx) => {
                      const isActive = idx === activeSearchIndex;
                      return (
                        <div
                          key={wishlist.Id}
                          className={`${styles['dropdown-item']} ${isActive ? styles['active-dropdown-item'] : ''}`}
                          onClick={() => handleSearchSelect(wishlist.Id)}
                          onMouseEnter={() => setActiveSearchIndex(idx)}
                        >
                          <Gift size={14} className={styles['dropdown-item-icon']} />
                          <div className={styles['dropdown-item-info']}>
                            <span className={styles['dropdown-item-title']}>{wishlist.Title}</span>
                            {wishlist.OwnerUsername && (
                              <span className={styles['dropdown-item-owner']}>@{wishlist.OwnerUsername}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : searchQuery.trim() !== '' ? (
                  <div className={styles['dropdown-status']}>No wishlists found matching "{searchQuery}"</div>
                ) : (
                  <div className={styles['dropdown-status']}>Type to search your wishlists...</div>
                )}
              </EnterPanel>
            )}
          </div>
        )}

        <div className={styles.right}>
          {isAuthenticated && <NotificationBell />}
          <div className={`${styles['dropdown-container']} ${styles['theme-selector']}`} ref={themeRef}>
            <button
              className={`${styles['nav-button']} ${styles['theme-nav-button']}`}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              aria-label="Theme settings"
              title="Change theme"
            >
              <div className={styles['theme-toggle-wrapper']}>
                <Palette size={18} className={styles['palette-icon']} />
                <div className={styles['mini-indicator']}>
                  {appearance === 'light' ? <Sun size={10} /> : <Moon size={10} />}
                </div>
              </div>
            </button>

            {isThemeOpen && (
              <EnterPanel animation="dropdown" className={`${styles['dropdown-menu']} ${styles['theme-menu']}`}>
                <div className={styles['menu-header']}>Style Theme</div>
                {standardThemes.map((t) => {
                  const unlocked = isThemeUnlocked(t.value);
                  return (
                    <button
                      key={t.value}
                      className={`${styles['menu-item']} ${theme === t.value ? styles['active-item'] : ''} ${!unlocked ? styles['locked-item'] : ''}`}
                      onClick={() => {
                        if (unlocked) {
                          setTheme(t.value);
                          setIsThemeOpen(false);
                        }
                      }}
                      disabled={!unlocked}
                    >
                      <span>{t.label}</span>
                      {!unlocked && <Lock size={12} className={styles['lock-icon']} />}
                    </button>
                  );
                })}

                {holidayThemes.some(t => isThemeUnlocked(t.value)) && (
                  <>
                    <button
                      className={`${styles['menu-item']} ${styles['holiday-toggle']}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHolidayOpen(!isHolidayOpen);
                      }}
                    >
                      <span>Holiday</span>
                      <ChevronDown
                        size={12}
                        className={`${styles.chevron} ${isHolidayOpen ? styles['rotated-chevron'] : ''}`}
                      />
                    </button>

                    {isHolidayOpen && (
                      <div className={styles['holiday-sub-menu']}>
                        {holidayThemes
                          .filter((t) => isThemeUnlocked(t.value))
                          .map((t) => (
                            <button
                              key={t.value}
                              className={`${styles['menu-item']} ${styles['holiday-menu-item']} ${theme === t.value ? styles['active-item'] : ''}`}
                              onClick={() => {
                                setTheme(t.value);
                                setIsThemeOpen(false);
                              }}
                            >
                              <span>{t.label}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </>
                )}
                {customThemes && customThemes.length > 0 && (
                  <>
                    <div className={styles['menu-divider']} />
                    <div className={styles['menu-header']}>Custom Themes</div>
                    {customThemes.map((ct) => (
                      <button
                        key={ct.id}
                        className={`${styles['menu-item']} ${theme === ct.id ? styles['active-item'] : ''}`}
                        onClick={() => {
                          setTheme(ct.id);
                          setIsThemeOpen(false);
                        }}
                      >
                        <span>{ct.name}</span>
                      </button>
                    ))}
                  </>
                )}

                {temporaryTheme && (
                  <>
                    <div className={styles['menu-divider']} />
                    <div className={styles['menu-header']}>Tried Theme</div>
                    <button
                      className={`${styles['menu-item']} ${theme === temporaryTheme.id ? styles['active-item'] : ''}`}
                      onClick={() => {
                        setTheme(temporaryTheme.id);
                        setIsThemeOpen(false);
                      }}
                    >
                      <span>{temporaryTheme.label}</span>
                    </button>
                  </>
                )}
                
                <div className={styles['menu-divider']} />
                
                <div className={styles['menu-header']}>Appearance</div>
                {appearances.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.value}
                      className={`${styles['menu-item']} ${appearance === a.value ? styles['active-item'] : ''}`}
                      onClick={() => {
                        setAppearance(a.value);
                        setIsThemeOpen(false);
                      }}
                    >
                      <Icon size={14} className={styles['item-icon']} />
                      {a.label}
                    </button>
                  );
                })}
              </EnterPanel>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className={`${styles['dropdown-container']} ${styles['profile-selector']}`} ref={profileRef}>
              <button
                className={styles['profile-trigger']}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div
                  className={styles.avatar}
                  style={avatarStyle}
                >
                  {shouldShowAvatarInitials(user.Avatar) && (user.FirstName ? user.FirstName[0].toUpperCase() : user.Username[0].toUpperCase())}
                </div>
                <ChevronDown size={14} className={styles.chevron} />
              </button>

              {isProfileOpen && (
                <ProfileMenu
                  user={user}
                  onSettings={() => {
                    setIsProfileOpen(false);
                    navigate('/settings/account');
                  }}
                  onFriends={() => {
                    setIsProfileOpen(false);
                    navigate('/friends/current');
                  }}
                  onLogout={handleLogout}
                />
              )}
            </div>
          ) : (
            <div className={styles['auth-buttons']}>
              <Link to="/login" className={styles['login-btn']}>Sign In</Link>
              <Link to="/register" className={styles['register-btn']}>Get Started</Link>
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
      />
    </nav>
  );
};
