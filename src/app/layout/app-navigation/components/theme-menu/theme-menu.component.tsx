import React, { useEffect, useRef, useState } from 'react';
import { APPEARANCES } from 'core/theme/constants/appearances.constant';
import {
  getHolidayThemes,
  getStandardThemes,
} from 'core/theme/utils/theme-catalog.util';
import { Moon, Palette, Sun } from 'lucide-react';
import type { ThemeMenuProps } from './interfaces/theme-menu-props.interface';
import { ThemeMenuTemplate } from './theme-menu.html';
import styles from './theme-menu.module.css';

const APPEARANCE_ICONS = {
  light: Sun,
  dark: Moon,
  system: Palette,
} as const;

export const ThemeMenu: React.FC<ThemeMenuProps> = ({
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  customThemes,
  temporaryTheme,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current?.contains(e.target as Node) === false) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeTheme = () => setIsThemeOpen(false);

  const standardThemes = getStandardThemes().map((t) => {
    const unlocked = isThemeUnlocked(t.value);
    return {
      value: t.value,
      label: t.label,
      unlocked,
      isActive: theme === t.value,
      onSelect: () => {
        if (!unlocked) {
          return;
        }
        setTheme(t.value);
        closeTheme();
      },
    };
  });

  const holidayThemes = getHolidayThemes()
    .filter((t) => isThemeUnlocked(t.value))
    .map((t) => ({
      value: t.value,
      label: t.label,
      isActive: theme === t.value,
      onSelect: () => {
        setTheme(t.value);
        closeTheme();
      },
    }));

  const customThemeItems = (customThemes ?? []).map((ct) => ({
    id: ct.id,
    name: ct.name,
    isActive: theme === ct.id,
    onSelect: () => {
      setTheme(ct.id);
      closeTheme();
    },
  }));

  const temporaryThemeItem = temporaryTheme
    ? {
        id: temporaryTheme.id,
        label: temporaryTheme.label,
        isActive: theme === temporaryTheme.id,
        onSelect: () => {
          setTheme(temporaryTheme.id);
          closeTheme();
        },
      }
    : null;

  const appearances = APPEARANCES.map((a) => {
    const Icon = APPEARANCE_ICONS[a.value];
    return {
      value: a.value,
      label: a.label,
      icon: <Icon size={14} className={styles['item-icon']} />,
      isActive: appearance === a.value,
      onSelect: () => {
        setAppearance(a.value);
        closeTheme();
      },
    };
  });

  return (
    <ThemeMenuTemplate
      themeRef={themeRef}
      isThemeOpen={isThemeOpen}
      onToggleTheme={() => setIsThemeOpen(!isThemeOpen)}
      appearance={appearance}
      standardThemes={standardThemes}
      showHolidaySection={holidayThemes.length > 0}
      isHolidayOpen={isHolidayOpen}
      onToggleHoliday={() => setIsHolidayOpen(!isHolidayOpen)}
      holidayThemes={holidayThemes}
      customThemes={customThemeItems}
      temporaryTheme={temporaryThemeItem}
      appearances={appearances}
    />
  );
};
