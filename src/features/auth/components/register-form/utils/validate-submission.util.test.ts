import { describe, expect, test } from 'vitest';
import { validateSubmission } from './validate-submission.util';
import type { ValidateSubmissionInput } from '../interfaces/validate-submission-input.interface';

const validBase: ValidateSubmissionInput = {
  username: 'johndoe',
  email: '',
  firstName: 'John',
  lastName: 'Doe',
  password: 'secret1',
  confirmPassword: 'secret1',
  requireStrongPasswords: false,
};

describe('validateSubmission', () => {
  test('accepts a valid open-registration payload', () => {
    expect(validateSubmission(validBase)).toEqual({ ok: true, username: 'johndoe' });
  });

  test('rejects missing required fields', () => {
    expect(validateSubmission({ ...validBase, firstName: '' })).toEqual({
      ok: false,
      message: 'Please fill out all required fields.',
    });
  });

  test('rejects invalid optional email', () => {
    expect(validateSubmission({ ...validBase, email: 'not-an-email' })).toEqual({
      ok: false,
      message: 'Please enter a valid email address, or leave it blank.',
    });
  });

  test('rejects weak password when strong passwords required', () => {
    expect(
      validateSubmission({
        ...validBase,
        password: 'short',
        confirmPassword: 'short',
        requireStrongPasswords: true,
      }),
    ).toEqual({
      ok: false,
      message: 'Password must be at least 8 characters long.',
    });
  });

  test('rejects mismatched passwords', () => {
    expect(
      validateSubmission({ ...validBase, confirmPassword: 'other' }),
    ).toEqual({
      ok: false,
      message: 'Passwords do not match.',
    });
  });
});
