/** Must match giftistry-bun Username VO / username-policy. */

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;

export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/;

/** Same pattern as backend Email VO — used to reject email-shaped usernames. */
export const USERNAME_EMAIL_LIKE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const USERNAME_POLICY_MESSAGE =
  'Username must be 3-32 characters (letters, numbers, _ or -)';

export const USERNAME_EMAIL_MESSAGE = 'Username cannot be an email address';

export const USERNAME_REQUIRED_MESSAGE = 'Username is required';
