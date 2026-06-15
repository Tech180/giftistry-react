import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Palette } from 'lucide-react';
import { useAuth } from 'app/providers/AuthContext';
import { useTheme, Theme, Appearance } from 'app/providers/ThemeContext';
import { NavigationTemplate } from './navigation.html';

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, appearance, setTheme, setAppearance } = useTheme();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const themes: { value: Theme; label: string }[] = [
    { value: 'default', label: 'Linear' },
    { value: 'neon', label: 'Neon' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'mystic', label: 'Mystic' },
    { value: 'burnt-forest', label: 'Burnt Forest' },
  ];

  const appearances: { value: Appearance; label: string; icon: any }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Palette },
  ];

  return (
    <NavigationTemplate
      user={user}
      isAuthenticated={isAuthenticated}
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      isProfileOpen={isProfileOpen}
      setIsProfileOpen={setIsProfileOpen}
      isThemeOpen={isThemeOpen}
      setIsThemeOpen={setIsThemeOpen}
      profileRef={profileRef}
      themeRef={themeRef}
      handleLogout={handleLogout}
      themes={themes}
      appearances={appearances}
      navigate={navigate}
    />
  );
};
