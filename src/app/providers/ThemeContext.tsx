import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { ThemeContextType } from './interfaces/theme-context-type.interface';

export type Theme = "default" | "neon" | "cyberpunk" | "mystic" | "burnt-forest";
export type Appearance = "light" | "dark" | "system";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default");
  const [appearance, setAppearanceState] = useState<Appearance>("system");

  useEffect(() => {
    // 1. Initialize Appearance
    const savedAppearance = localStorage.getItem("giftistry-appearance") as Appearance | null;
    const initialAppearance = savedAppearance || "system";
    setAppearanceState(initialAppearance);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyAppearance = (mode: Appearance) => {
      const effectiveMode = mode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : mode;
      document.documentElement.setAttribute("data-appearance", effectiveMode);
    };

    applyAppearance(initialAppearance);

    const handleSystemChange = () => {
      const currentMode = localStorage.getItem("giftistry-appearance") as Appearance | null;
      if (!currentMode || currentMode === "system") {
        applyAppearance("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    // 2. Initialize Theme
    const savedTheme = localStorage.getItem("giftistry-theme") as Theme | null;
    const initialTheme = savedTheme || "default";
    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("giftistry-theme", newTheme);
  };

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    localStorage.setItem("giftistry-appearance", newAppearance);
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const effectiveMode = newAppearance === "system"
      ? (mediaQuery.matches ? "dark" : "light")
      : newAppearance;
    document.documentElement.setAttribute("data-appearance", effectiveMode);
  };

  const toggleAppearance = () => {
    let nextAppearance: Appearance;
    if (appearance === "light") nextAppearance = "dark";
    else if (appearance === "dark") nextAppearance = "system";
    else nextAppearance = "light";
    setAppearance(nextAppearance);
  };

  return (
    <ThemeContext.Provider value={{ theme, appearance, setTheme, setAppearance, toggleAppearance }}>
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
