export function resolveAppearance(
  appearance: 'light' | 'dark' | 'system',
): 'light' | 'dark' {
  if (appearance === 'light' || appearance === 'dark') {
    return appearance;
  }

  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
