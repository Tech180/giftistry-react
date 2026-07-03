import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeContextType } from './interfaces/theme-context-type.interface';
import { Theme } from './interfaces/theme.interface';
import { Appearance } from './interfaces/appearance.interface';
import { AuthContext } from './auth-context';
import { applyCustomTheme, clearCustomTheme } from 'core/theme/apply-custom-theme';
import { env } from 'core/config/env';

export type { Theme } from './interfaces/theme.interface';
export type { Appearance } from './interfaces/appearance.interface';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const BASE_URL = env.apiUrl;

let lastRequestedUrl = "";

/**
 * Loads the theme stylesheet in the background and swaps it into the DOM once loaded
 * to avoid visual Flash of Unstyled Content (FOUC).
 */
function updateThemeStylesheet(theme: string, appearance: string): Promise<void> {
  return new Promise((resolve) => {
    const url = `${BASE_URL}/api/themes/${theme}/${appearance}/css`;
    lastRequestedUrl = url;

    // Check if the current active stylesheet already has this URL
    const activeLink = document.getElementById("theme-stylesheet") as HTMLLinkElement | null;
    if (activeLink && activeLink.href === url) {
      resolve();
      return;
    }

    // Create new temporary link element
    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = url;
    newLink.setAttribute("data-theme-style", "pending");

    // Once loaded, swap it into place
    newLink.onload = () => {
      if (lastRequestedUrl === url) {
        const oldLink = document.getElementById("theme-stylesheet");
        newLink.id = "theme-stylesheet";
        newLink.removeAttribute("data-theme-style");
        
        if (oldLink && oldLink !== newLink) {
          oldLink.parentNode?.removeChild(oldLink);
        }
      } else {
        // Discard stale style load
        if (newLink.parentNode) {
          newLink.parentNode.removeChild(newLink);
        }
      }
      resolve();
    };

    newLink.onerror = () => {
      console.error(`Failed to load theme stylesheet from: ${url}`);
      if (newLink.parentNode) {
        newLink.parentNode.removeChild(newLink);
      }
      resolve();
    };

    // If no existing stylesheet, set ID immediately so it can be resolved early (and by tests)
    const existingLink = document.getElementById("theme-stylesheet");
    if (!existingLink) {
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
    const defaults: Theme[] = ["default", "neon", "cyberpunk", "mystic", "burnt-forest"];
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

  // Check for holiday theme unlocking
  useEffect(() => {
    const defaults: Theme[] = ["default", "neon", "cyberpunk", "mystic", "burnt-forest"];
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

  // Effect to handle theme and appearance changes reactively
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getEffectiveAppearance = (appMode: Appearance) => {
      return appMode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : appMode;
    };

    const effectiveAppearance = getEffectiveAppearance(appearance);

    // Apply attributes for CSS selector matching
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-appearance", effectiveAppearance);

    // Trigger Double Link Swap
    updateThemeStylesheet(theme.startsWith('custom-') ? 'default' : theme, effectiveAppearance);

    // Listen for system appearance updates if system mode is active
    const handleSystemChange = () => {
      if (appearance === "system") {
        const nextEffective = mediaQuery.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-appearance", nextEffective);
        updateThemeStylesheet(theme.startsWith('custom-') ? 'default' : theme, nextEffective);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, appearance]);

  // Apply custom theme CSS variables if enabled
  useEffect(() => {
    const useCustom = localStorage.getItem('giftistry-use-custom-theme') === 'true' || theme.startsWith('custom-');
    const savedCustom = localStorage.getItem('giftistry-custom-theme');
    if (useCustom && savedCustom) {
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
    } else {
      console.warn(`Attempted to set locked theme: ${newTheme}`);
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
    <ThemeContext.Provider value={{ theme, appearance, setTheme, setAppearance, toggleAppearance, unlockedThemes, isThemeUnlocked }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
