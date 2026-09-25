import { describe, expect, it } from 'vitest';
import { webAuthnErrorMessage } from './webauthn-error-message.util';

const HINT =
  "Passkeys only work when this page's address matches the app's Public App URL hostname.";

describe('webAuthnErrorMessage', () => {
  it('returns null for user cancel (NotAllowedError)', () => {
    const err = new DOMException('The operation either timed out or was not allowed.', 'NotAllowedError');
    expect(webAuthnErrorMessage(err)).toBeNull();
  });

  it('maps rp.id / origin SecurityError to the hostname hint', () => {
    const err = new DOMException("'rp.id' cannot be used with the current origin", 'SecurityError');
    expect(webAuthnErrorMessage(err)).toBe(HINT);
  });

  it('maps message text containing rp.id even without SecurityError name', () => {
    expect(webAuthnErrorMessage(new Error("'rp.id' cannot be used with the current origin"))).toBe(HINT);
  });

  it('maps Chromium RP ID invalid-for-session wording', () => {
    expect(
      webAuthnErrorMessage(new Error("The RP ID 'localhost' is invalid for this session"))
    ).toBe(HINT);
  });

  it('returns the error message for other failures', () => {
    expect(webAuthnErrorMessage(new Error('Authenticator unavailable'))).toBe('Authenticator unavailable');
  });

  it('returns a fallback for non-Error values', () => {
    expect(webAuthnErrorMessage('boom')).toBe('Passkey authentication failed.');
  });
});
