import type { ThemePreview } from 'core/theme/interfaces/theme-preview.interface';
import type { ThemeOption } from '../interfaces/theme-option.interface';

export function toThemeOptions(previews: readonly ThemePreview[]): ThemeOption[] {
  return previews.map((preview) => ({
    id: preview.id,
    label: preview.label,
    previewBg: preview.bg,
    previewAccent: preview.primary,
  }));
}
