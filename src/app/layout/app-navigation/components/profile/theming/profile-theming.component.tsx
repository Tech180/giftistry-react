import React, { useEffect, useState } from 'react';
import { ProfileThemingProps } from './interfaces/profile-theming-props.interface';
import { ProfileThemingTemplate } from './profile-theming.html';
import { DRAWER_APPEARANCES } from './constants/drawer-appearances.constant';
import { SWATCHES_TO_DISPLAY } from './constants/swatches-to-display.constant';
import { VISIBLE_SWATCHES } from './constants/visible-swatches.constant';

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

  const unlockedSwatches = SWATCHES_TO_DISPLAY.filter((swatch) => isThemeUnlocked(swatch.value));
  const maxSwatchOffset = Math.max(0, unlockedSwatches.length - VISIBLE_SWATCHES);
  const visibleSwatches = unlockedSwatches.slice(swatchOffset, swatchOffset + VISIBLE_SWATCHES);

  useEffect(() => {
    if (!isActive) setSwatchOffset(0);
  }, [isActive]);

  useEffect(() => {
    setSwatchOffset((offset) => Math.min(offset, maxSwatchOffset));
  }, [maxSwatchOffset]);

  useEffect(() => {
    const unlocked = SWATCHES_TO_DISPLAY.filter((s) => isThemeUnlocked(s.value));
    const activeIndex = unlocked.findIndex((s) => s.value === theme);
    if (activeIndex < 0) return;
    setSwatchOffset(
      Math.min(
        Math.max(0, unlocked.length - VISIBLE_SWATCHES),
        Math.max(0, activeIndex - Math.floor(VISIBLE_SWATCHES / 2)),
      ),
    );
  }, [theme, isThemeUnlocked, interactive]);

  return (
    <ProfileThemingTemplate
      theme={theme}
      appearance={appearance}
      setTheme={setTheme}
      setAppearance={setAppearance}
      tabIndex={interactive ? 0 : -1}
      appearances={DRAWER_APPEARANCES}
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
