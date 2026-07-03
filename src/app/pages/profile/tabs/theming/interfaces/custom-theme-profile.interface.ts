export interface CustomThemeProfile {
  id: string;
  name: string;
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
}
export default CustomThemeProfile;
