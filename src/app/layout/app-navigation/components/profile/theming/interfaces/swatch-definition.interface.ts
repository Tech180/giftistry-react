import type { Theme } from 'app/providers/interfaces/theme.interface';

export interface SwatchDefinition {
  value: Theme;
  label: string;
  primary: string;
  secondary: string;
}
