import React, { useState, useEffect, useContext, useMemo, ReactNode } from 'react';
import { AuthContext } from 'features/auth';
import { ThemeContext } from './context';
import type { Theme } from './interfaces/theme.type';
import type { Appearance } from './interfaces/appearance.type';
import type { CustomThemeProfile } from './interfaces/custom-theme-profile.interface';
import type { ApiCustomTheme } from './interfaces/api-custom-theme.interface';
import type { ThemeContextType } from './interfaces/context-type.interface';
import { applyCustomTheme, clearCustomTheme } from 'core/theme/apply-custom-theme';
import { resolveAppearance } from 'core/theme/resolve-appearance.util';
import { apiClient } from 'core/api/client';
import { STANDARD_THEME_IDS } from 'core/theme/constants/theme-catalog.constant';
import { isPresetThemeId } from 'core/theme/utils/theme-catalog.util';
import {
  THEME_STORAGE_KEY,
  APPEARANCE_STORAGE_KEY,
  UNLOCKED_THEMES_STORAGE_KEY,
  CUSTOM_THEMES_STORAGE_KEY,
  CUSTOM_THEME_STORAGE_KEY,
  USE_CUSTOM_THEME_STORAGE_KEY,
} from './constants/storage-keys.constant';
import { updateThemeStylesheet } from './utils/update-theme-stylesheet.util';
import { mapApiThemeToProfile, buildCustomThemeApiPayload } from './utils/map-api-theme-to-profile.util';
import { resolveUnlockedHolidayThemes } from './utils/resolve-unlocked-holiday-themes.util';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const user = auth ? auth.user : null;

  const [unlockedThemes, setUnlockedThemes] = useState<Theme[]>(() => {
    try {
      const saved = localStorage.getItem(UNLOCKED_THEMES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return Array.from(new Set([...STANDARD_THEME_IDS, ...parsed])) as Theme[];
        }
      }
    } catch (e) {
      console.error('Failed to parse unlocked themes', e);
    }
    return STANDARD_THEME_IDS as Theme[];
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return savedTheme || 'default';
  });
  const [appearance, setAppearanceState] = useState<Appearance>(() => {
    const savedAppearance = localStorage.getItem(APPEARANCE_STORAGE_KEY) as Appearance | null;
    return savedAppearance || 'system';
  });

  const [temporaryTheme, setTemporaryTheme] = useState<{ id: string; label: string } | null>(null);

  const [customThemes, setCustomThemes] = useState<CustomThemeProfile[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchCustomThemes = async () => {
    try {
      const res = await apiClient.get<{ Themes: ApiCustomTheme[] }>('/api/themes/custom');
      if (res && res.Themes) {
        const mapped = res.Themes.map(mapApiThemeToProfile);
        setCustomThemes(mapped);
        localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(mapped));
      }
    } catch (err) {
      console.error('Failed to fetch custom themes from database:', err);
    }
  };

  const saveCustomTheme = async (profile: CustomThemeProfile) => {
    const updatedList = [...customThemes.filter((t) => t.id !== profile.id), profile];
    setCustomThemes(updatedList);
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updatedList));

    const activeThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (profile.id === activeThemeId || profile.id === theme) {
      localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(USE_CUSTOM_THEME_STORAGE_KEY, 'true');
    }

    if (user) {
      try {
        await apiClient.post('/api/themes/custom', buildCustomThemeApiPayload(profile), 'Theme');
      } catch (err) {
        console.error('Failed to sync saved custom theme to database:', err);
      }
    }
  };

  const deleteCustomTheme = async (id: string) => {
    const updatedList = customThemes.filter((t) => t.id !== id);
    setCustomThemes(updatedList);
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updatedList));

    if (user) {
      try {
        await apiClient.delete(`/api/themes/custom/${id}`);
      } catch (err) {
        console.error('Failed to sync deleted custom theme to database:', err);
      }
    }
  };

  // Check for holiday theme unlocking
  useEffect(() => {
    const next = resolveUnlockedHolidayThemes(unlockedThemes, user?.CreatedAt);
    if (next) {
      setUnlockedThemes(next);
      localStorage.setItem(UNLOCKED_THEMES_STORAGE_KEY, JSON.stringify(next));
    }
  }, [user, unlockedThemes]);

  // Fallback to default if the current theme is locked
  useEffect(() => {
    if (!unlockedThemes.includes(theme) && !theme.startsWith('custom-')) {
      setThemeState('default');
      localStorage.setItem(THEME_STORAGE_KEY, 'default');
    }
  }, [theme, unlockedThemes]);

  // Synchronize theme and custom themes with user preference from database upon login/refresh
  useEffect(() => {
    if (user) {
      fetchCustomThemes();
      if (user.Theme && user.Theme !== theme) {
        if (unlockedThemes.includes(user.Theme as Theme) || user.Theme.startsWith('custom-')) {
          setThemeState(user.Theme as Theme);
          localStorage.setItem(THEME_STORAGE_KEY, user.Theme);
        }
      }
    }
  }, [user?.Theme]);

  // Effect to handle theme and appearance changes reactively.
  // Load CSS first, then set data-* attributes so selectors always match an active sheet.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    let cancelled = false;

    const applyTheme = async (nextTheme: string, nextAppearance: Appearance) => {
      const effectiveAppearance = resolveAppearance(nextAppearance);
      const hasLocalCustom =
        nextTheme.startsWith('custom-') &&
        (() => {
          try {
            const savedCustom = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
            return savedCustom && JSON.parse(savedCustom).id === nextTheme;
          } catch {
            return false;
          }
        })();

      const stylesheetTheme = nextTheme.startsWith('custom-') && hasLocalCustom ? 'default' : nextTheme;
      const hadThemeAttr = document.documentElement.hasAttribute('data-theme');

      // First paint only: set attributes immediately so tokens resolve while the sheet loads.
      // On later switches, wait until the new sheet is ready to avoid a blank frame where
      // data-theme no longer matches the still-active previous stylesheet.
      if (!hadThemeAttr) {
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.documentElement.setAttribute('data-appearance', effectiveAppearance);
      }

      const result = await updateThemeStylesheet(stylesheetTheme, effectiveAppearance);
      if (cancelled || !result.ok) {
        return;
      }

      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.setAttribute('data-appearance', effectiveAppearance);
    };

    void applyTheme(theme, appearance);

    const handleSystemChange = () => {
      if (appearance === 'system') {
        void applyTheme(theme, appearance);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      cancelled = true;
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme, appearance]);

  // Apply custom theme CSS variables if enabled
  useEffect(() => {
    const useCustom =
      localStorage.getItem(USE_CUSTOM_THEME_STORAGE_KEY) === 'true' || theme.startsWith('custom-');
    const savedCustom = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);

    let hasLocalCustom = false;
    if (theme.startsWith('custom-') && savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (parsed.id === theme) {
          hasLocalCustom = true;
        }
      } catch {
        // ignore parse errors
      }
    }

    if (useCustom && hasLocalCustom && savedCustom) {
      try {
        applyCustomTheme(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Error applying custom theme', e);
      }
    } else {
      clearCustomTheme();
    }
  }, [theme, appearance]);

  const value = useMemo((): ThemeContextType => {
    const setTheme = (newTheme: Theme) => {
      setTemporaryTheme(null);

      if (unlockedThemes.includes(newTheme) || newTheme.startsWith('custom-')) {
        if (newTheme.startsWith('custom-')) {
          localStorage.setItem(USE_CUSTOM_THEME_STORAGE_KEY, 'true');
          const customThemesRaw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
          if (customThemesRaw) {
            try {
              const list = JSON.parse(customThemesRaw) as CustomThemeProfile[];
              const found = list.find((ct) => ct.id === newTheme);
              if (found) {
                localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(found));
              }
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          localStorage.setItem(USE_CUSTOM_THEME_STORAGE_KEY, 'false');
        }
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);

        if (auth && auth.user && auth.updateProfile) {
          auth
            .updateProfile(
              auth.user.Username,
              auth.user.FirstName,
              auth.user.LastName,
              auth.user.Bio || undefined,
              newTheme,
              auth.user.Avatar
            )
            .catch((err) => {
              console.error('Failed to save theme selection to user profile:', err);
            });
        }
      } else {
        console.warn(`Attempted to set locked theme: ${newTheme}`);
      }
    };

    const tryTheme = (themeId: string, ownerUsername: string) => {
      if (isPresetThemeId(themeId)) {
        setTheme(themeId as Theme);
      } else {
        setTemporaryTheme({ id: themeId, label: `${ownerUsername}'s Theme` });
        setThemeState(themeId as Theme);
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
      }
    };

    const setAppearance = (newAppearance: Appearance) => {
      setAppearanceState(newAppearance);
      localStorage.setItem(APPEARANCE_STORAGE_KEY, newAppearance);
    };

    const toggleAppearance = () => {
      let nextAppearance: Appearance;
      if (appearance === 'light') {
        nextAppearance = 'dark';
      } else if (appearance === 'dark') {
        nextAppearance = 'system';
      } else {
        nextAppearance = 'light';
      }
      setAppearance(nextAppearance);
    };

    const isThemeUnlocked = (t: Theme) => {
      return unlockedThemes.includes(t);
    };

    return {
      theme,
      appearance,
      setTheme,
      setAppearance,
      toggleAppearance,
      unlockedThemes,
      isThemeUnlocked,
      temporaryTheme,
      tryTheme,
      customThemes,
      saveCustomTheme,
      deleteCustomTheme,
    };
  }, [theme, appearance, unlockedThemes, temporaryTheme, customThemes, auth, user]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
