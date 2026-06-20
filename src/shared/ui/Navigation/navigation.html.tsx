import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sun, Moon, LogOut, User as UserIcon, Search, ChevronDown, Palette } from 'lucide-react';
import { NavigationTemplateProps } from 'shared/interfaces/navigation-template-props.interface';
import styles from './navigation.module.css';

export const NavigationTemplate: React.FC<NavigationTemplateProps> = ({
  user,
  isAuthenticated,
  theme,
  appearance,
  setTheme,
  setAppearance,
  isProfileOpen,
  setIsProfileOpen,
  isThemeOpen,
  setIsThemeOpen,
  profileRef,
  themeRef,
  handleLogout,
  themes,
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
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
            <svg
              className={styles.logoIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className={styles.giftLid}>
                <path d="M4 7h16v3H4z" />
                <path d="M12 7c-1.5-2.5-4-2.5-4 0 0 1.5 2.5 2.5 4 0z" />
                <path d="M12 7c1.5-2.5 4-2.5 4 0 0 1.5-2.5 2.5-4 0z" />
              </g>
              <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" />
              <path d="M12 10v12" />
            </svg>
            <span className={styles.logoText}>Giftistry</span>
          </Link>

          {isAuthenticated && (
            <div className={styles.navLinks}>
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
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
              <div className={`${styles['search-dropdown']} animate-scale-in`}>
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
              </div>
            )}
          </div>
        )}

        <div className={styles.right}>
          <div className={styles.dropdownContainer} ref={themeRef}>
            <button
              className={`${styles.navButton} ${styles.themeNavButton}`}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              aria-label="Theme settings"
              title="Change theme"
            >
              <div className={styles.themeToggleWrapper}>
                <Palette size={18} className={styles.paletteIcon} />
                <div className={styles.miniIndicator}>
                  {appearance === 'light' ? <Sun size={10} /> : <Moon size={10} />}
                </div>
              </div>
            </button>

            {isThemeOpen && (
              <div className={`${styles.dropdownMenu} ${styles.themeMenu} animate-scale-in`}>
                <div className={styles.menuHeader}>Style Theme</div>
                {themes.map((t) => (
                  <button
                    key={t.value}
                    className={`${styles.menuItem} ${theme === t.value ? styles.activeItem : ''}`}
                    onClick={() => {
                      setTheme(t.value);
                      setIsThemeOpen(false);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
                
                <div className={styles.menuDivider} />
                
                <div className={styles.menuHeader}>Appearance</div>
                {appearances.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.value}
                      className={`${styles.menuItem} ${appearance === a.value ? styles.activeItem : ''}`}
                      onClick={() => {
                        setAppearance(a.value);
                        setIsThemeOpen(false);
                      }}
                    >
                      <Icon size={14} className={styles.itemIcon} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className={styles.dropdownContainer} ref={profileRef}>
              <button
                className={styles.profileTrigger}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className={styles.avatar}>
                  {user.FirstName ? user.FirstName[0].toUpperCase() : user.Username[0].toUpperCase()}
                </div>
                <ChevronDown size={14} className={styles.chevron} />
              </button>

              {isProfileOpen && (
                <div className={`${styles.dropdownMenu} ${styles.profileMenu} animate-scale-in`}>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.FirstName} {user.LastName}</div>
                    <div className={styles.userEmail}>@{user.Username}</div>
                  </div>
                  
                  <div className={styles.menuDivider} />
                  
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <UserIcon size={14} className={styles.itemIcon} />
                    Edit Profile
                  </button>
                  
                  <button
                    className={`${styles.menuItem} ${styles.dangerItem}`}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} className={styles.itemIcon} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className={styles.registerBtn}>Get Started</Link>
            </div>
          )}
        </div>
      </div>


    </nav>
  );
};
