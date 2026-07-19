import { describe, expect, it } from 'vitest';
import {
  formatApiErrorMessage,
  mapValidationErrorsToFields,
} from './format-api-error-message.util';

const passwordValidation = {
  type: 'validation',
  on: 'body',
  property: '/Giftistry/Auth/Password',
  message: 'Expected string length greater or equal to 8',
  summary: 'Expected string length greater or equal to 8',
  expected: { Giftistry: { Auth: { Username: ' ', Password: ' ' } } },
  found: {
    Giftistry: {
      Auth: {
        Username: 'tester',
        FirstName: 'Riley',
        LastName: 'Lawson',
        Password: 'test123',
      },
    },
  },
  errors: [
    {
      summary: 'Expected string length greater or equal to 8',
      type: 52,
      schema: { minLength: 8, type: 'string' },
      path: '/Giftistry/Auth/Password',
      value: 'test123',
      message: 'Expected string length greater or equal to 8',
      errors: [],
    },
  ],
};

describe('formatApiErrorMessage', () => {
  it('formats password minLength validation into plain language', () => {
    expect(formatApiErrorMessage(passwordValidation)).toBe(
      'Password must be at least 8 characters.'
    );
  });

  it('formats stringified validation JSON', () => {
    expect(formatApiErrorMessage(JSON.stringify(passwordValidation))).toBe(
      'Password must be at least 8 characters.'
    );
  });

  it('passes through normal string messages', () => {
    expect(formatApiErrorMessage('Setup failed')).toBe('Setup failed');
  });
});

describe('mapValidationErrorsToFields', () => {
  it('maps Password path to adminPassword', () => {
    expect(
      mapValidationErrorsToFields(passwordValidation, { Password: 'adminPassword' })
    ).toEqual({
      adminPassword: 'Password must be at least 8 characters.',
    });
  });
});
