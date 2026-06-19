import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Palette } from 'lucide-react';
import { useAuth } from 'app/providers/AuthContext';
import { useTheme, Theme, Appearance } from 'app/providers/ThemeContext';
import { wishlistsApi, Wishlist } from 'features/wishlists';
import { NavigationTemplate } from './navigation.html';

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, appearance, setTheme, setAppearance } = useTheme();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
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

  // Keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isAuthenticated && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAuthenticated]);

  // Fetch wishlists when search opens
  useEffect(() => {
    if (isSearchOpen) {
      const fetchLists = async () => {
        setIsSearchLoading(true);
        try {
          const res = await wishlistsApi.listWishlists();
          setWishlists(res || []);
        } catch (err) {
          // fallback silently
        } finally {
          setIsSearchLoading(false);
        }
      };
      fetchLists();
      setSearchQuery('');
      setActiveSearchIndex(0);
    }
  }, [isSearchOpen]);

  // Filter wishlists
  const searchResults = wishlists.filter((w) =>
    w.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = useCallback((wishlistId: string) => {
    setIsSearchOpen(false);
    navigate(`/wishlists/${wishlistId}`);
  }, [navigate]);

  // Keyboard navigation within the modal
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown' && searchResults.length > 0) {
        e.preventDefault();
        setActiveSearchIndex((prev) => (prev + 1) % searchResults.length);
      } else if (e.key === 'ArrowUp' && searchResults.length > 0) {
        e.preventDefault();
        setActiveSearchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
      } else if (e.key === 'Enter' && searchResults.length > 0) {
        e.preventDefault();
        const selected = searchResults[activeSearchIndex];
        if (selected) {
          handleSearchSelect(selected.Id);
        }
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isSearchOpen, searchResults, activeSearchIndex, handleSearchSelect]);

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
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      isSearchLoading={isSearchLoading}
      activeSearchIndex={activeSearchIndex}
      setActiveSearchIndex={setActiveSearchIndex}
      handleSearchSelect={handleSearchSelect}
      searchRef={searchRef}
      searchInputRef={searchInputRef}
    />
  );
};
