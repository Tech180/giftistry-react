import { Theme } from 'app/providers/interfaces/theme.interface';

export interface SwatchDefinition {
  value: Theme;
  label: string;
  primary: string;
  secondary: string;
}

/** Matches theming-tab preset swatches (primary accent + secondary surface/bg). */
export const SWATCHES_TO_DISPLAY: SwatchDefinition[] = [
  { value: 'default', label: 'Linear', primary: '#5e6ad2', secondary: '#0f0f10' },
  { value: 'neon', label: 'Neon', primary: '#00ffcc', secondary: '#05050a' },
  { value: 'cyberpunk', label: 'Cyberpunk', primary: '#ff0055', secondary: '#1a0033' },
  { value: 'mystic', label: 'Mystic', primary: '#b829c2', secondary: '#0d0b14' },
  { value: 'burnt-forest', label: 'Burnt Forest', primary: '#e65c00', secondary: '#0f140f' },
  { value: 'paper', label: 'Paper', primary: '#4a5568', secondary: '#f5f0e6' },
  { value: 'paper-mario', label: 'Paper Mario', primary: '#e52521', secondary: '#87ceeb' },
  { value: 'retro-80s', label: "80's Retro", primary: '#ff6ec7', secondary: '#1a0a2e' },
  { value: 'pixel', label: 'Pixel Art', primary: '#e52521', secondary: '#1a1c2c' },
  { value: 'matrix', label: 'Matrix', primary: '#00ff41', secondary: '#0d0208' },
  { value: 'terminal', label: 'Terminal', primary: '#ffb000', secondary: '#0a0a0a' },
  { value: 'vaporwave', label: 'Vaporwave', primary: '#ff71ce', secondary: '#1a0033' },
  { value: 'arcade', label: 'Arcade', primary: '#ff0040', secondary: '#1a1a2e' },
  { value: 'valentines', label: "Valentine's", primary: '#e11d48', secondary: '#fff5f5' },
  { value: 'st-patricks', label: "St. Patrick's", primary: '#15803d', secondary: '#f0fdf4' },
  { value: 'earth-day', label: 'Earth Day', primary: '#0d9488', secondary: '#f0fdfa' },
  { value: 'independence', label: 'Independence', primary: '#1d4ed8', secondary: '#f8fafc' },
  { value: 'halloween', label: 'Halloween', primary: '#ea580c', secondary: '#0c0a09' },
  { value: 'thanksgiving', label: 'Thanksgiving', primary: '#b45309', secondary: '#fdf8f2' },
  { value: 'christmas', label: 'Christmas', primary: '#b91c1c', secondary: '#f4fbf7' },
];
