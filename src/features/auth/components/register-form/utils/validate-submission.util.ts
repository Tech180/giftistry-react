import { validateUsername } from 'shared/utils/validate-username.util';
import { EMAIL_PATTERN } from '../constants/email-pattern.constant';
import type { ValidateSubmissionInput } from '../interfaces/validate-submission-input.interface';
import type { ValidateSubmissionResult } from '../interfaces/validate-submission-result.type';

export function validateSubmission(input: ValidateSubmissionInput): ValidateSubmissionResult {
  const { username, email, firstName, lastName, password, confirmPassword, requireStrongPasswords } = input;

  if (!username || !password || !firstName || !lastName) {
    return { ok: false, message: 'Please fill out all required fields.' };
  }

  const usernameCheck = validateUsername(username);

  if (!usernameCheck.ok) {
    return { ok: false, message: usernameCheck.message };
  }

  if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, message: 'Please enter a valid email address, or leave it blank.' };
  }

  if (requireStrongPasswords) {
    if (password.length < 8) {
      return { ok: false, message: 'Password must be at least 8 characters long.' };
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return { ok: false, message: 'Password must include at least one letter and one number.' };
    }
  } else if (password.length < 6) {
    return { ok: false, message: 'Password must be at least 6 characters long.' };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'Passwords do not match.' };
  }

  return { ok: true, username: usernameCheck.value };
}
