import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sun, Moon, LogOut, User as UserIcon, Search, ChevronDown } from 'lucide-react';
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
}) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
            <Gift className={styles.logoIcon} size={20} />
            <span className={styles.logoText}>Giftistry</span>
          </Link>

          {isAuthenticated && (
            <div className={styles.navLinks}>
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className={styles.searchMock}>
            <Search size={14} className={styles.searchIcon} />
            <span className={styles.searchText}>Search wishlists...</span>
            <span className={styles.searchHotkey}>⌘K</span>
          </div>
        )}

        <div className={styles.right}>
          <div className={styles.dropdownContainer} ref={themeRef}>
            <button
              className={styles.navButton}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              aria-label="Theme settings"
              title="Change theme"
            >
              {appearance === 'light' ? <Sun size={18} /> : <Moon size={18} />}
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
