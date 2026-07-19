import { Appearance } from 'app/providers/interfaces/appearance.interface';
import { Monitor, Moon, Sun } from 'lucide-react';

export const DRAWER_APPEARANCES: {
  value: Appearance;
  label: string;
  icon: typeof Monitor;
}[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
];

export const VISIBLE_SWATCHES = 5;
