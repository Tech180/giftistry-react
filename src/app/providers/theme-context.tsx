import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeContextType } from './interfaces/theme-context-type.interface';
import { AuthContext } from './auth-context';

export type Theme = "default" | "neon" | "cyberpunk" | "mystic" | "burnt-forest" | "valentines" | "st-patricks" | "earth-day" | "independence" | "halloween" | "thanksgiving" | "christmas";
export type Appearance = "light" | "dark" | "system";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
    if (!unlockedThemes.includes(theme)) {
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
    updateThemeStylesheet(theme, effectiveAppearance);

    // Listen for system appearance updates if system mode is active
    const handleSystemChange = () => {
      if (appearance === "system") {
        const nextEffective = mediaQuery.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-appearance", nextEffective);
        updateThemeStylesheet(theme, nextEffective);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, appearance]);

  // Apply custom theme CSS variables if enabled
  useEffect(() => {
    const useCustom = localStorage.getItem('giftistry-use-custom-theme') === 'true';
    const savedCustom = localStorage.getItem('giftistry-custom-theme');
    if (useCustom && savedCustom) {
      try {
        const obj = JSON.parse(savedCustom);
        const colors = obj.colors;
        if (colors) {
          const hexToRgb = (hex: string): string => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
          };
          document.documentElement.style.setProperty('--primary', colors.primary);
          document.documentElement.style.setProperty('--primary-hover', `${colors.primary}dd`);
          document.documentElement.style.setProperty('--primary-rgb', hexToRgb(colors.primary));
          document.documentElement.style.setProperty('--bg', colors.bg);
          document.documentElement.style.setProperty('--surface', colors.surface);
          document.documentElement.style.setProperty('--border', colors.border);
          document.documentElement.style.setProperty('--text', colors.text);
          document.documentElement.style.setProperty('--text-muted', colors['text-muted'] || colors.textMuted);
        }
        if (obj.advanced) {
          const adv = obj.advanced;
          if (adv.shadows) {
            if (adv.shadows.sm) document.documentElement.style.setProperty('--shadow-sm', adv.shadows.sm);
            if (adv.shadows.md) document.documentElement.style.setProperty('--shadow', adv.shadows.md);
            if (adv.shadows.lg) document.documentElement.style.setProperty('--shadow-lg', adv.shadows.lg);
          }
          if (adv.fonts && adv.fonts.sans) {
            document.documentElement.style.setProperty('--font-family', adv.fonts.sans);
          }
          if (adv.radius && adv.radius.default) {
            document.documentElement.style.setProperty('--radius', adv.radius.default);
          }
        }
      } catch (e) {
        console.error("Error applying custom theme", e);
      }
    } else {
      const vars = ['--primary', '--primary-hover', '--primary-rgb', '--bg', '--surface', '--border', '--text', '--text-muted', '--shadow-sm', '--shadow', '--shadow-lg', '--font-family', '--radius'];
      vars.forEach(v => document.documentElement.style.removeProperty(v));
    }
  }, [theme, appearance]);

  const setTheme = (newTheme: Theme) => {
    if (unlockedThemes.includes(newTheme)) {
      localStorage.setItem('giftistry-use-custom-theme', 'false');
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
