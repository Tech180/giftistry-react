import type { Theme } from 'app/providers/interfaces/theme.interface';

export const STANDARD_THEMES: { value: Theme; label: string }[] = [
  { value: 'default', label: 'Linear' },
  { value: 'neon', label: 'Neon' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'mystic', label: 'Mystic' },
  { value: 'burnt-forest', label: 'Burnt Forest' },
  { value: 'paper', label: 'Paper' },
  { value: 'paper-mario', label: 'Paper Mario' },
  { value: 'retro-80s', label: "80's Retro" },
  { value: 'pixel', label: 'Pixel Art' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'vaporwave', label: 'Vaporwave' },
  { value: 'arcade', label: 'Arcade' },
];
