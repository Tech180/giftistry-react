import type { ListDisplayPreferences } from './list-display-preferences.interface';

export interface ListDisplayCustomPreset {
  id: string;
  label: string;
  preferences: ListDisplayPreferences;
}
