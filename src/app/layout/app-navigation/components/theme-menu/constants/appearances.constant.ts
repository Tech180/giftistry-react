import type { Appearance } from 'app/providers/interfaces/appearance.interface';
import { Moon, Palette, Sun } from 'lucide-react';

export const APPEARANCES: {
  value: Appearance;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Palette },
];
