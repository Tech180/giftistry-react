import { RefObject } from 'react';
import { Theme, Appearance } from 'app/providers/ThemeContext';
import { User } from 'app/providers/AuthContext';
import { Wishlist } from 'features/wishlists/interfaces/wishlist.interface';

export interface NavigationTemplateProps {
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isThemeOpen: boolean;
  setIsThemeOpen: (open: boolean) => void;
  profileRef: RefObject<HTMLDivElement | null>;
  themeRef: RefObject<HTMLDivElement | null>;
  handleLogout: () => void;
  themes: { value: Theme; label: string }[];
  appearances: { value: Appearance; label: string; icon: any }[];
  navigate: (to: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Wishlist[];
  isSearchLoading: boolean;
  activeSearchIndex: number;
  setActiveSearchIndex: (index: number) => void;
  handleSearchSelect: (wishlistId: string) => void;
  searchRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
}
