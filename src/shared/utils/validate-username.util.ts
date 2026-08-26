import {
  USERNAME_EMAIL_LIKE_REGEX,
  USERNAME_EMAIL_MESSAGE,
  USERNAME_POLICY_MESSAGE,
  USERNAME_REGEX,
  USERNAME_REQUIRED_MESSAGE,
} from '../constants/username-policy.constant';

export type UsernameValidationResult =
  | { ok: true; value: string }
  | { ok: false; message: string };

/**
 * Client-side username policy — mirrors giftistry-bun Username VO.
 */
export function validateUsername(raw: string): UsernameValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: USERNAME_REQUIRED_MESSAGE };
  }
  if (trimmed.includes('@') || USERNAME_EMAIL_LIKE_REGEX.test(trimmed)) {
    return { ok: false, message: USERNAME_EMAIL_MESSAGE };
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    return { ok: false, message: USERNAME_POLICY_MESSAGE };
  }
  return { ok: true, value: trimmed };
}
