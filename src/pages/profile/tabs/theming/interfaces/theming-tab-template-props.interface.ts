import { PresetThemeInfo } from './preset-theme-info.interface';

export interface ThemingTabTemplateProps {
  themeName: string;
  setThemeName: (name: string) => void;
  isNameDisabled: boolean;
  colors: {
    primary: string;
    bg: string;
    surface: string;
    border: string;
    text: string;
    'text-muted': string;
  };
  advanced: {
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    fonts: {
      sans: string;
    };
    radius: {
      default: string;
    };
  };
  handleHexInputChange: (key: string, val: string) => void;
  handlePickerChange: (key: string, val: string) => void;
  handleAdvancedChange: (section: string, key: string, val: string) => void;
  presetThemes: PresetThemeInfo[];
  onSelectPreset: (value: string) => void;
  onAddNewCustomTheme: () => void;
  jsonError: boolean;
  copyThemeJson: () => void;
  onResetTheme: () => void;
  onDeleteCustomTheme: (id: string) => void;
  invalidColorFields: string[];
}
export default ThemingTabTemplateProps;
