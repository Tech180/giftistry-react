import React, { useEffect, useState } from 'react';
import type { Theme } from 'app/providers/theme/interfaces/theme.type';
import { APPEARANCES } from 'core/theme/constants/appearances.constant';
import { loadThemePreviews } from 'core/theme/load-theme-previews.util';
import { resolveAppearance } from 'core/theme/resolve-appearance.util';
import { getAllPresetThemes } from 'core/theme/utils/theme-catalog.util';
import { Monitor, Moon, Sun } from 'lucide-react';
import { VISIBLE_SWATCHES } from './constants/visible-swatches.constant';
import type { ProfileThemingProps } from './interfaces/profile-theming-props.interface';
import type { SwatchDefinition } from './interfaces/swatch-definition.interface';
import { ProfileThemingTemplate } from './profile-theming.html';

const APPEARANCE_ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const SWATCH_CATALOG = getAllPresetThemes();

export const ProfileTheming: React.FC<ProfileThemingProps> = ({
  theme,
  appearance,
  setTheme,
  setAppearance,
  isThemeUnlocked,
  interactive,
  isActive,
}) => {
  const [swatchOffset, setSwatchOffset] = useState(0);
  const [swatches, setSwatches] = useState<SwatchDefinition[]>([]);

  useEffect(() => {
    let cancelled = false;
    const effective = resolveAppearance(appearance);

    void loadThemePreviews(SWATCH_CATALOG, effective).then((previews) => {
      if (cancelled) {
        return;
      }
      setSwatches(
        previews.map((preview) => ({
          value: preview.id as Theme,
          label: preview.label,
          primary: preview.primary,
          secondary: preview.bg,
        })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [appearance]);

  const unlockedSwatches = swatches.filter((swatch) => isThemeUnlocked(swatch.value));
  const maxSwatchOffset = Math.max(0, unlockedSwatches.length - VISIBLE_SWATCHES);
  const visibleSwatches = unlockedSwatches.slice(swatchOffset, swatchOffset + VISIBLE_SWATCHES);

  useEffect(() => {
    if (!isActive) {
      setSwatchOffset(0);
    }
  }, [isActive]);

  useEffect(() => {
    setSwatchOffset((offset) => Math.min(offset, maxSwatchOffset));
  }, [maxSwatchOffset]);

  useEffect(() => {
    const unlocked = swatches.filter((s) => isThemeUnlocked(s.value));
    const activeIndex = unlocked.findIndex((s) => s.value === theme);
    if (activeIndex < 0) {
      return;
    }
    setSwatchOffset(
      Math.min(
        Math.max(0, unlocked.length - VISIBLE_SWATCHES),
        Math.max(0, activeIndex - Math.floor(VISIBLE_SWATCHES / 2)),
      ),
    );
  }, [theme, isThemeUnlocked, interactive, swatches]);

  const appearances = APPEARANCES.map((option) => ({
    ...option,
    icon: APPEARANCE_ICONS[option.value],
  }));

  return (
    <ProfileThemingTemplate
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      tabIndex={interactive ? 0 : -1}
      appearances={appearances}
      unlockedSwatches={unlockedSwatches}
      visibleSwatches={visibleSwatches}
      swatchOffset={swatchOffset}
      maxSwatchOffset={maxSwatchOffset}
      onPreviousSwatches={() => setSwatchOffset((offset) => Math.max(0, offset - VISIBLE_SWATCHES))}
      onNextSwatches={() =>
        setSwatchOffset((offset) => Math.min(maxSwatchOffset, offset + VISIBLE_SWATCHES))
      }
    />
  );
};
