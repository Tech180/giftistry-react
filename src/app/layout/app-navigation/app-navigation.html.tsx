import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sun, Moon, LogOut, Settings, Search, ChevronDown, Palette, Lock, Users } from 'lucide-react';
import { NotificationBell } from 'features/notifications';
import { getAvatarStyle, shouldShowAvatarInitials } from 'shared/utils/avatar.util';
import { NavigationTemplateProps } from './interfaces/navigation-template-props.interface';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
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
}) => {
  const avatarStyle: React.CSSProperties = user?.Avatar ? getAvatarStyle(user.Avatar) : getAvatarStyle(null);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
            <svg
              className={styles['logo-icon']}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className={styles['gift-lid']}>
                <path d="M4 7h16v3H4z" />
                <path d="M12 7c-1.5-2.5-4-2.5-4 0 0 1.5 2.5 2.5 4 0z" />
                <path d="M12 7c1.5-2.5 4-2.5 4 0 0 1.5-2.5 2.5-4 0z" />
              </g>
              <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" />
              <path d="M12 10v12" />
            </svg>
            <span>Giftistry</span>
          </Link>

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
          <div className={styles['dropdown-container']} ref={themeRef}>
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
            <div className={styles['dropdown-container']} ref={profileRef}>
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
                <EnterPanel animation="dropdown" className={styles['dropdown-menu']}>
                  <div className={styles['user-info']}>
                    <div className={styles['user-name']}>{user.FirstName} {user.LastName}</div>
                    <div className={styles['user-email']}>@{user.Username}</div>
                  </div>
                  
                  <div className={styles['menu-divider']} />
                  
                  <button
                    className={styles['menu-item']}
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings/account');
                    }}
                  >
                    <Settings size={14} className={styles['item-icon']} />
                    Settings
                  </button>

                  <button
                    className={styles['menu-item']}
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/friends/current');
                    }}
                  >
                    <Users size={14} className={styles['item-icon']} />
                    Friends
                  </button>
                  
                  <button
                    className={`${styles['menu-item']} ${styles['danger-item']}`}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} className={styles['item-icon']} />
                    Sign Out
                  </button>
                </EnterPanel>
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


    </nav>
  );
};
