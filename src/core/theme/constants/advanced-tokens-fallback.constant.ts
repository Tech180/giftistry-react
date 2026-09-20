import type { AdvancedTokens } from '../interfaces/advanced-tokens.interface';

/** Last resort when computed CSS is unavailable (tests/SSR). Aligned with theming-engine core. */
export const ADVANCED_TOKENS_FALLBACK: AdvancedTokens = {
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  fonts: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  radius: {
    default: '8px',
  },
};
