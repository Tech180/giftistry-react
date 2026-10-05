import type { ListDisplayPreferences } from './list-display-preferences.interface';

export interface ListDisplayBuiltInPreset {
  id: string;
  label: string;
  preferences: ListDisplayPreferences;
}
