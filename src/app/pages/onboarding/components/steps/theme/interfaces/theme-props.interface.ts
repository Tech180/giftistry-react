import type { MouseEvent } from 'react';
import type { ThemeOption } from '../../../../interfaces/theme-option.interface';

export interface ThemeProps {
  theme: string;
  themeOptions: ThemeOption[];
  onSelect: (themeId: string) => void;
  onGlowMove: (event: MouseEvent<HTMLElement>) => void;
}
