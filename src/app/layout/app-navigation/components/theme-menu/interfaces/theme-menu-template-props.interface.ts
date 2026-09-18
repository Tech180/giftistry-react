import type { Appearance } from 'app/providers/interfaces/appearance.interface';
import type { Theme } from 'app/providers/interfaces/theme.interface';
import type { RefObject, ReactNode } from 'react';

export interface ThemeMenuThemeItem {
  value: Theme;
  label: string;
  unlocked: boolean;
  isActive: boolean;
  onSelect: () => void;
}

export interface ThemeMenuHolidayItem {
  value: Theme;
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

export interface ThemeMenuCustomItem {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
}

export interface ThemeMenuTemporaryItem {
  id: string;
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

export interface ThemeMenuAppearanceItem {
  value: Appearance;
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onSelect: () => void;
}

export interface ThemeMenuTemplateProps {
  themeRef: RefObject<HTMLDivElement | null>;
  isThemeOpen: boolean;
  onToggleTheme: () => void;
  appearance: Appearance;
  standardThemes: ThemeMenuThemeItem[];
  showHolidaySection: boolean;
  isHolidayOpen: boolean;
  onToggleHoliday: () => void;
  holidayThemes: ThemeMenuHolidayItem[];
  customThemes: ThemeMenuCustomItem[];
  temporaryTheme: ThemeMenuTemporaryItem | null;
  appearances: ThemeMenuAppearanceItem[];
}
