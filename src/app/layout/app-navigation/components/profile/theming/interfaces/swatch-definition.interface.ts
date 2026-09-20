import type { Theme } from 'app/providers/theme/interfaces/theme.type';

export interface SwatchDefinition {
  value: Theme;
  label: string;
  primary: string;
  secondary: string;
}
