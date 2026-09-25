const RP_ID_ORIGIN_HINT =
  "Passkeys only work when this page's address matches the app's Public App URL hostname.";

function asNamedMessage(error: unknown): { name: string; message: string } | null {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as { name?: unknown; message?: unknown };
    const name = typeof record.name === 'string' ? record.name : '';
    const message = typeof record.message === 'string' ? record.message : '';
    if (name || message) {
      return { name, message };
    }
  }

  return null;
}

function isRpIdOriginMismatch(message: string): boolean {
  return (
    /rp[\s.]?id/i.test(message) ||
    /cannot be used with the current origin/i.test(message) ||
    /invalid for this session/i.test(message)
  );
}

/** Map a WebAuthn / SimpleWebAuthn failure to a user-facing message, or null to stay silent (user cancel). */
export function webAuthnErrorMessage(error: unknown): string | null {
  const named = asNamedMessage(error);
  if (!named) {
    return 'Passkey authentication failed.';
  }

  if (named.name === 'NotAllowedError') {
    return null;
  }

  if (named.name === 'SecurityError' || isRpIdOriginMismatch(named.message)) {
    return RP_ID_ORIGIN_HINT;
  }

  return named.message || 'Passkey authentication failed.';
}
