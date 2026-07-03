const TOKEN_MAP = {
  primary: '--primary',
  bg: '--bg',
  surface: '--surface',
  border: '--border',
  text: '--text',
  'text-muted': '--text-muted',
} as const;

export function readComputedTokens(): Record<keyof typeof TOKEN_MAP, string> {
  const computed = getComputedStyle(document.documentElement);
  return {
    primary: computed.getPropertyValue('--primary').trim(),
    bg: computed.getPropertyValue('--bg').trim(),
    surface: computed.getPropertyValue('--surface').trim(),
    border: computed.getPropertyValue('--border').trim(),
    text: computed.getPropertyValue('--text').trim(),
    'text-muted': computed.getPropertyValue('--text-muted').trim(),
  };
}

export { TOKEN_MAP };
