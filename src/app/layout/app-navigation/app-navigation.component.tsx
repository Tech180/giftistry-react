import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'features/auth';
import { useTheme } from 'app/providers/theme';
import { AppNavigationTemplate } from './app-navigation.html';

export const AppNavigation: React.FC = () => {
  const { user, isAuthenticated, logout, registrationMode } = useAuth();
  const {
    theme,
    appearance,
    setTheme,
    setAppearance,
    isThemeUnlocked,
    customThemes,
    temporaryTheme,
  } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 48rem)');
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };

    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleMediaChange);
    else mediaQuery.addListener(handleMediaChange);

    if (mediaQuery.matches) setIsMobileMenuOpen(false);

    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', handleMediaChange);
      else mediaQuery.removeListener(handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        mobileMenuRef.current?.contains(target) === false &&
        hamburgerRef.current?.contains(target) !== true
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppNavigationTemplate
      user={user}
      isAuthenticated={isAuthenticated}
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      isThemeUnlocked={isThemeUnlocked}
      customThemes={customThemes}
      temporaryTheme={temporaryTheme}
      handleLogout={handleLogout}
      navigate={navigate}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      mobileMenuRef={mobileMenuRef}
      hamburgerRef={hamburgerRef}
      showRegisterCta={registrationMode === 'open'}
    />
  );
};
