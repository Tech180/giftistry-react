import type { ThemePreviewColors } from './interfaces/theme-preview-colors.interface';

function extractCssVar(cssText: string, varName: string): string | null {
  const pattern = new RegExp(`(?:^|[\\s{;])${varName}\\s*:\\s*([^;}\\n]+)`, 'm');
  const match = cssText.match(pattern);
  const value = match?.[1]?.trim();
  return value || null;
}

function requireCssVar(cssText: string, names: readonly string[]): string {
  for (const name of names) {
    const value = extractCssVar(cssText, name);
    if (value) return value;
  }
  throw new Error(`Missing CSS vars: ${names.join(' | ')}`);
}

export function parseThemePreviewColors(cssText: string): ThemePreviewColors {
  return {
    primary: requireCssVar(cssText, ['--theme-primary', '--primary']),
    bg: requireCssVar(cssText, ['--theme-bg', '--bg']),
  };
}
