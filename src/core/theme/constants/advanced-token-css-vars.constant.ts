/** App + theme CSS custom property names for advanced token seeding. */
export const ADVANCED_TOKEN_CSS_VARS = {
  shadows: {
    sm: '--shadow-sm',
    md: '--shadow',
    lg: '--shadow-lg',
    theme: '--theme-shadow',
  },
  fonts: {
    sans: '--font-family-body',
    theme: '--theme-font-body',
  },
  radius: {
    default: '--radius',
    theme: '--theme-radius',
  },
} as const;
