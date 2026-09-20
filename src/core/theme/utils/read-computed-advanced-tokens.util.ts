import { ADVANCED_TOKEN_CSS_VARS } from '../constants/advanced-token-css-vars.constant';
import { ADVANCED_TOKENS_FALLBACK } from '../constants/advanced-tokens-fallback.constant';
import type { AdvancedTokens } from '../interfaces/advanced-tokens.interface';

function getCssVar(computed: CSSStyleDeclaration, name: string, fallback: string): string {
  const primary = computed.getPropertyValue(name).trim();

  if (primary) {
    return primary;
  }

  return fallback;
}

export function readComputedAdvancedTokens(): AdvancedTokens {
  if (typeof document === 'undefined') {
    return {
      shadows: { ...ADVANCED_TOKENS_FALLBACK.shadows },
      fonts: { ...ADVANCED_TOKENS_FALLBACK.fonts },
      radius: { ...ADVANCED_TOKENS_FALLBACK.radius },
    };
  }

  const computed = getComputedStyle(document.documentElement);
  const { shadows, fonts, radius } = ADVANCED_TOKEN_CSS_VARS;
  const themeShadow = computed.getPropertyValue(shadows.theme).trim();
  const themeFontBody = computed.getPropertyValue(fonts.theme).trim();
  const themeRadius = computed.getPropertyValue(radius.theme).trim();

  return {
    shadows: {
      sm: getCssVar(computed, shadows.sm, themeShadow || ADVANCED_TOKENS_FALLBACK.shadows.sm),
      md: getCssVar(computed, shadows.md, themeShadow || ADVANCED_TOKENS_FALLBACK.shadows.md),
      lg: getCssVar(computed, shadows.lg, themeShadow || ADVANCED_TOKENS_FALLBACK.shadows.lg),
    },
    fonts: {
      sans: getCssVar(computed, fonts.sans, themeFontBody || ADVANCED_TOKENS_FALLBACK.fonts.sans),
    },
    radius: {
      default: getCssVar(
        computed,
        radius.default,
        themeRadius || ADVANCED_TOKENS_FALLBACK.radius.default,
      ),
    },
  };
}
