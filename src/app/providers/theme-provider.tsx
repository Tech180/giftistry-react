import React, { useState, useEffect, useContext, ReactNode } from "react";
import { ThemeContext } from './theme-context';
import { Theme } from './interfaces/theme.interface';
import { Appearance } from './interfaces/appearance.interface';
import { AuthContext } from './auth-context';
import { applyCustomTheme, clearCustomTheme } from 'core/theme/apply-custom-theme';
import { env } from 'core/config/env';
import { apiClient } from "core/api/client";

const BASE_URL = env.apiUrl;

const CORE_DEFAULT_THEMES: Theme[] = [
  'default', 'neon', 'cyberpunk', 'mystic', 'burnt-forest',
  'paper', 'paper-mario', 'retro-80s', 'pixel', 'matrix', 'terminal', 'vaporwave', 'arcade',
];

let lastRequestedUrl = "";

type ThemeStylesheetResult = { ok: boolean; url: string };

/**
 * Loads the theme stylesheet in the background and swaps it into the DOM once loaded.
 * Callers should update data-theme / data-appearance only after a successful load,
 * otherwise selectors stop matching while the previous stylesheet is still active
 * (blank/white screen).
 */
function updateThemeStylesheet(theme: string, appearance: string): Promise<ThemeStylesheetResult> {
  return new Promise((resolve) => {
    const url = `${BASE_URL}/api/themes/${theme}/${appearance}/css`;
    lastRequestedUrl = url;

    const activeLink = document.getElementById("theme-stylesheet") as HTMLLinkElement | null;
    if (activeLink && activeLink.href === url) {
      resolve({ ok: true, url });
      return;
    }

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = url;
    newLink.setAttribute("data-theme-style", "pending");

    const finish = (ok: boolean) => {
      if (lastRequestedUrl !== url) {
        if (newLink.parentNode) {
          newLink.parentNode.removeChild(newLink);
        }
        resolve({ ok: false, url });
        return;
      }

      if (!ok) {
        console.error(`Failed to load theme stylesheet from: ${url}`);
        if (newLink.parentNode) {
          newLink.parentNode.removeChild(newLink);
        }
        resolve({ ok: false, url });
        return;
      }

      const oldLink = document.getElementById("theme-stylesheet");
      newLink.id = "theme-stylesheet";
      newLink.removeAttribute("data-theme-style");

      if (oldLink && oldLink !== newLink) {
        oldLink.parentNode?.removeChild(oldLink);
      }

      resolve({ ok: true, url });
    };

    newLink.onload = () => finish(true);
    newLink.onerror = () => finish(false);

    // First paint: promote immediately so tests / early consumers can find the link.
    // Subsequent swaps stay pending until load succeeds so the prior theme keeps matching.
    if (!activeLink) {
      newLink.id = "theme-stylesheet";
      newLink.removeAttribute("data-theme-style");
    }

    document.head.appendChild(newLink);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const user = auth ? auth.user : null;

  const [unlockedThemes, setUnlockedThemes] = useState<Theme[]>(() => {
    const defaults: Theme[] = CORE_DEFAULT_THEMES;
    try {
      const saved = localStorage.getItem("giftistry-unlocked-themes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return Array.from(new Set([...defaults, ...parsed])) as Theme[];
        }
      }
    } catch (e) {
      console.error("Failed to parse unlocked themes", e);
    }
    return defaults;
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("giftistry-theme") as Theme | null;
    return savedTheme || "default";
  });
  const [appearance, setAppearanceState] = useState<Appearance>(() => {
    const savedAppearance = localStorage.getItem("giftistry-appearance") as Appearance | null;
    return savedAppearance || "system";
  });

  const [temporaryTheme, setTemporaryTheme] = useState<{ id: string; label: string } | null>(null);

  const [customThemes, setCustomThemes] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('giftistry-custom-themes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const mapApiThemeToProfile = (theme: {
    Id: string;
    Name: string;
    Colors: Record<string, string>;
    Advanced?: Record<string, unknown>;
  }) => {
    const advanced = theme.Advanced as Record<string, Record<string, string>> | undefined;
    return {
      id: theme.Id,
      name: theme.Name,
      colors: {
        primary: theme.Colors.Primary,
        bg: theme.Colors.Bg,
        surface: theme.Colors.Surface,
        border: theme.Colors.Border,
        text: theme.Colors.Text,
        'text-muted': theme.Colors.TextMuted,
      },
      advanced: advanced ? {
        shadows: advanced.Shadows ? {
          sm: advanced.Shadows.Sm,
          md: advanced.Shadows.Md,
          lg: advanced.Shadows.Lg,
        } : undefined,
        fonts: advanced.Fonts ? {
          sans: advanced.Fonts.Sans,
        } : undefined,
        radius: advanced.Radius ? {
          default: advanced.Radius.Default,
        } : undefined,
      } : undefined,
    };
  };

  const fetchCustomThemes = async () => {
    try {
      const res = await apiClient.get<{ Themes: Array<{ Id: string; Name: string; Colors: Record<string, string>; Advanced?: Record<string, unknown> }> }>('/api/themes/custom');
      if (res && res.Themes) {
        const mapped = res.Themes.map(mapApiThemeToProfile);
        setCustomThemes(mapped);
        localStorage.setItem('giftistry-custom-themes', JSON.stringify(mapped));
      }
    } catch (err) {
      console.error("Failed to fetch custom themes from database:", err);
    }
  };

  const saveCustomTheme = async (profile: any) => {
    const updatedList = [...customThemes.filter(t => t.id !== profile.id), profile];
    setCustomThemes(updatedList);
    localStorage.setItem('giftistry-custom-themes', JSON.stringify(updatedList));

    if (user) {
      try {
        await apiClient.post('/api/themes/custom', {
          Id: profile.id,
          Name: profile.name,
          Colors: {
            Primary: profile.colors.primary,
            Bg: profile.colors.bg,
            Surface: profile.colors.surface,
            Border: profile.colors.border,
            Text: profile.colors.text,
            TextMuted: profile.colors['text-muted'] ?? profile.colors.textMuted,
          },
          Advanced: profile.advanced ? {
            Shadows: profile.advanced.shadows ? {
              Sm: profile.advanced.shadows.sm,
              Md: profile.advanced.shadows.md,
              Lg: profile.advanced.shadows.lg,
            } : undefined,
            Fonts: profile.advanced.fonts ? {
              Sans: profile.advanced.fonts.sans,
            } : undefined,
            Radius: profile.advanced.radius ? {
              Default: profile.advanced.radius.default,
            } : undefined,
          } : undefined,
        }, 'Theme');
      } catch (err) {
        console.error("Failed to sync saved custom theme to database:", err);
      }
    }
  };

  const deleteCustomTheme = async (id: string) => {
    const updatedList = customThemes.filter(t => t.id !== id);
    setCustomThemes(updatedList);
    localStorage.setItem('giftistry-custom-themes', JSON.stringify(updatedList));

    if (user) {
      try {
        await apiClient.delete(`/api/themes/custom/${id}`);
      } catch (err) {
        console.error("Failed to sync deleted custom theme to database:", err);
      }
    }
  };

  // Check for holiday theme unlocking
  useEffect(() => {
    const defaults: Theme[] = CORE_DEFAULT_THEMES;
    let currentUnlocked = [...unlockedThemes];
    let changed = false;

    if (user && user.CreatedAt) {
      const createdDate = new Date(user.CreatedAt);
      const now = new Date();
      const currentMonth = now.getMonth();

      const holidays: { theme: Theme; month: number; lastDay: number }[] = [
        { theme: "valentines", month: 1, lastDay: 28 },      // Feb (1)
        { theme: "st-patricks", month: 2, lastDay: 31 },     // Mar (2)
        { theme: "earth-day", month: 3, lastDay: 30 },       // Apr (3)
        { theme: "independence", month: 6, lastDay: 31 },    // Jul (6)
        { theme: "halloween", month: 9, lastDay: 31 },       // Oct (9)
        { theme: "thanksgiving", month: 10, lastDay: 30 },   // Nov (10)
        { theme: "christmas", month: 11, lastDay: 31 },      // Dec (11)
      ];

      for (const holiday of holidays) {
        if (currentMonth === holiday.month) {
          const maxRegDate = new Date(now.getFullYear(), holiday.month, holiday.lastDay, 23, 59, 59);
          if (createdDate <= maxRegDate && !currentUnlocked.includes(holiday.theme)) {
            currentUnlocked.push(holiday.theme);
            changed = true;
          }
        }
      }
    }

    if (changed) {
      const uniqueUnlocked = Array.from(new Set([...defaults, ...currentUnlocked])) as Theme[];
      setUnlockedThemes(uniqueUnlocked);
      localStorage.setItem("giftistry-unlocked-themes", JSON.stringify(uniqueUnlocked));
    }
  }, [user, unlockedThemes]);

  // Fallback to default if the current theme is locked
  useEffect(() => {
    if (!unlockedThemes.includes(theme) && !theme.startsWith('custom-')) {
      setThemeState("default");
      localStorage.setItem("giftistry-theme", "default");
    }
  }, [theme, unlockedThemes]);

  // Synchronize theme and custom themes with user preference from database upon login/refresh
  useEffect(() => {
    if (user) {
      fetchCustomThemes();
      if (user.Theme && user.Theme !== theme) {
        if (unlockedThemes.includes(user.Theme as Theme) || user.Theme.startsWith('custom-')) {
          setThemeState(user.Theme as Theme);
          localStorage.setItem("giftistry-theme", user.Theme);
        }
      }
    }
  }, [user?.Theme]);

  // Effect to handle theme and appearance changes reactively.
  // Load CSS first, then set data-* attributes so selectors always match an active sheet.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getEffectiveAppearance = (appMode: Appearance) => {
      return appMode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : appMode;
    };

    let cancelled = false;

    const applyTheme = async (nextTheme: string, nextAppearance: Appearance) => {
      const effectiveAppearance = getEffectiveAppearance(nextAppearance);
      const hasLocalCustom = nextTheme.startsWith('custom-') && (() => {
        try {
          const savedCustom = localStorage.getItem('giftistry-custom-theme');
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
      if (appearance === "system") {
        void applyTheme(theme, appearance);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => {
      cancelled = true;
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme, appearance]);

  // Apply custom theme CSS variables if enabled
  useEffect(() => {
    const useCustom = localStorage.getItem('giftistry-use-custom-theme') === 'true' || theme.startsWith('custom-');
    const savedCustom = localStorage.getItem('giftistry-custom-theme');

    let hasLocalCustom = false;
    if (theme.startsWith('custom-') && savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (parsed.id === theme) {
          hasLocalCustom = true;
        }
      } catch {}
    }

    if (useCustom && hasLocalCustom && savedCustom) {
      try {
        applyCustomTheme(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Error applying custom theme", e);
      }
    } else {
      clearCustomTheme();
    }
  }, [theme, appearance]);

  const setTheme = (newTheme: Theme) => {
    setTemporaryTheme(null); // Clear temporary try-theme preview on explicit choice

    if (unlockedThemes.includes(newTheme) || newTheme.startsWith('custom-')) {
      if (newTheme.startsWith('custom-')) {
        localStorage.setItem('giftistry-use-custom-theme', 'true');
        const customThemesRaw = localStorage.getItem('giftistry-custom-themes');
        if (customThemesRaw) {
          try {
            const list = JSON.parse(customThemesRaw);
            const found = list.find((ct: any) => ct.id === newTheme);
            if (found) {
              localStorage.setItem('giftistry-custom-theme', JSON.stringify(found));
            }
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        localStorage.setItem('giftistry-use-custom-theme', 'false');
      }
      setThemeState(newTheme);
      localStorage.setItem("giftistry-theme", newTheme);

      // Persist theme choice to backend user profile if authenticated
      if (auth && auth.user && auth.updateProfile) {
        auth.updateProfile(
          auth.user.Username,
          auth.user.FirstName,
          auth.user.LastName,
          auth.user.Bio || undefined,
          newTheme,
          auth.user.Avatar
        ).catch((err) => {
          console.error("Failed to save theme selection to user profile:", err);
        });
      }
    } else {
      console.warn(`Attempted to set locked theme: ${newTheme}`);
    }
  };

  const tryTheme = (themeId: string, ownerUsername: string) => {
    const isPreset = CORE_DEFAULT_THEMES.includes(themeId as Theme) || [
      'valentines', 'st-patricks', 'earth-day', 'independence', 'halloween', 'thanksgiving', 'christmas'
    ].includes(themeId);

    if (isPreset) {
      setTheme(themeId as Theme);
    } else {
      setTemporaryTheme({ id: themeId, label: `${ownerUsername}'s Theme` });
      setThemeState(themeId as Theme);
      localStorage.setItem("giftistry-theme", themeId);
    }
  };

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    localStorage.setItem("giftistry-appearance", newAppearance);
  };

  const toggleAppearance = () => {
    let nextAppearance: Appearance;
    if (appearance === "light") nextAppearance = "dark";
    else if (appearance === "dark") nextAppearance = "system";
    else nextAppearance = "light";
    setAppearance(nextAppearance);
  };

  const isThemeUnlocked = (t: Theme) => {
    return unlockedThemes.includes(t);
  };

  return (
    <ThemeContext.Provider value={{
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
      deleteCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
