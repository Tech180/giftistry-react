export interface CustomThemeInput {
  colors: {
    primary: string;
    bg: string;
    surface: string;
    border: string;
    text: string;
    'text-muted'?: string;
    textMuted?: string;
  };
  advanced?: {
    shadows?: { sm?: string; md?: string; lg?: string };
    fonts?: { sans?: string };
    radius?: { default?: string };
  };
}
