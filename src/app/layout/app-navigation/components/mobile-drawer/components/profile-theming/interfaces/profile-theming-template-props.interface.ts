import type { ComponentType } from 'react';
import { Appearance } from 'app/providers/interfaces/appearance.interface';
import { Theme } from 'app/providers/interfaces/theme.interface';
import { SwatchDefinition } from '../utils/swatch-config';

export interface ProfileThemingAppearanceOption {
  value: Appearance;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

export interface ProfileThemingTemplateProps {
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  tabIndex: number;
  appearances: ProfileThemingAppearanceOption[];
  unlockedSwatches: SwatchDefinition[];
  visibleSwatches: SwatchDefinition[];
  swatchOffset: number;
  maxSwatchOffset: number;
  onPreviousSwatches: () => void;
  onNextSwatches: () => void;
}
