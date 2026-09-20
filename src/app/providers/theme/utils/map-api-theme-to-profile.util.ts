import type { ApiCustomTheme } from '../interfaces/api-custom-theme.interface';
import type { CustomThemeProfile } from '../interfaces/custom-theme-profile.interface';

export function mapApiThemeToProfile(theme: ApiCustomTheme): CustomThemeProfile {
  const advanced = theme.Advanced;

  return {
    id: theme.Id,
    name: theme.Name,
    colors: {
      primary: theme.Colors.Primary,
      bg: theme.Colors.Bg,
      surface: theme.Colors.Surface,
      border: theme.Colors.Border,
      text: theme.Colors.Text,
      'text-muted': theme.Colors.TextMuted,
    },
    advanced: advanced
      ? {
          shadows: advanced.Shadows
            ? {
                sm: advanced.Shadows.Sm,
                md: advanced.Shadows.Md,
                lg: advanced.Shadows.Lg,
              }
            : undefined,
          fonts: advanced.Fonts
            ? {
                sans: advanced.Fonts.Sans,
              }
            : undefined,
          radius: advanced.Radius
            ? {
                default: advanced.Radius.Default,
              }
            : undefined,
        }
      : undefined,
  };
}

export function buildCustomThemeApiPayload(profile: CustomThemeProfile): ApiCustomTheme {
  return {
    Id: profile.id,
    Name: profile.name,
    Colors: {
      Primary: profile.colors.primary,
      Bg: profile.colors.bg,
      Surface: profile.colors.surface,
      Border: profile.colors.border,
      Text: profile.colors.text,
      TextMuted: profile.colors['text-muted'] ?? profile.colors.textMuted ?? '',
    },
    Advanced: profile.advanced
      ? {
          Shadows: profile.advanced.shadows
            ? {
                Sm: profile.advanced.shadows.sm,
                Md: profile.advanced.shadows.md,
                Lg: profile.advanced.shadows.lg,
              }
            : undefined,
          Fonts: profile.advanced.fonts
            ? {
                Sans: profile.advanced.fonts.sans,
              }
            : undefined,
          Radius: profile.advanced.radius
            ? {
                Default: profile.advanced.radius.default,
              }
            : undefined,
        }
      : undefined,
  };
}
