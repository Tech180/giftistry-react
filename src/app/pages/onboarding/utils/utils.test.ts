import { describe, expect, test } from 'vitest';
import { getStandardThemes } from 'core/theme/utils/theme-catalog.util';
import { buildSteps } from './build-steps.util';
import { buildPersistPayload } from './build-persist-payload.util';
import { getPrimaryCtaLabel } from './get-primary-cta-label.util';
import { getStepCopy } from './get-step-copy.util';
import { isOwnerStep } from './is-owner-step.util';
import { isSkipAllowed } from './is-skip-allowed.util';
import { toThemeOptions } from './to-theme-options.util';

const STANDARD_THEMES = getStandardThemes();

const baseForm = {
  firstName: 'Jane',
  lastName: 'Doe',
  bio: 'Hi',
  theme: 'neon',
  publicAppUrl: ' http://localhost:3000 ',
  registrationMode: 'invite_only' as const,
  smtpType: 'remote' as const,
  smtpHost: 'smtp.example.com',
  smtpPort: '465',
  smtpFrom: 'noreply@example.com',
  aiEnabled: true,
  aiWebSearchEnabled: false,
};

describe('onboarding utils', () => {
  test('buildSteps appends owner steps when required', () => {
    expect(buildSteps(false)).toEqual(['hello', 'theme', 'profile', 'done']);
    expect(buildSteps(true)).toEqual([
      'hello',
      'theme',
      'profile',
      'public_url',
      'registration',
      'mail',
      'ai',
      'done',
    ]);
  });

  test('isOwnerStep and isSkipAllowed', () => {
    expect(isOwnerStep('mail')).toBe(true);
    expect(isOwnerStep('theme')).toBe(false);
    expect(isSkipAllowed('hello')).toBe(true);
    expect(isSkipAllowed('done')).toBe(false);
  });

  test('getStepCopy and getPrimaryCtaLabel', () => {
    expect(getStepCopy('theme').title).toBe('Pick your look');
    expect(getPrimaryCtaLabel('hello')).toBe("Let's go");
    expect(getPrimaryCtaLabel('done')).toBe('Enter Dashboard');
    expect(getPrimaryCtaLabel('theme')).toBe('Continue');
  });

  test('buildPersistPayload for profile/theme merges user fields', () => {
    expect(
      buildPersistPayload({
        stepId: 'theme',
        form: baseForm,
        isOwnerStep: false,
      }),
    ).toEqual({
      FirstName: 'Jane',
      LastName: 'Doe',
      Bio: 'Hi',
      Theme: 'neon',
    });
  });

  test('buildPersistPayload skip owner', () => {
    expect(
      buildPersistPayload({
        stepId: 'mail',
        form: baseForm,
        isOwnerStep: true,
        skip: true,
      }),
    ).toEqual({ CompleteOwner: true, SkipOwner: true });
  });

  test('buildPersistPayload defers owner ai completion to handleNext', () => {
    expect(
      buildPersistPayload({
        stepId: 'ai',
        form: baseForm,
        isOwnerStep: true,
      }),
    ).toBeNull();
  });

  test('toThemeOptions maps engine previews and matches STANDARD_THEMES', () => {
    const options = toThemeOptions(
      STANDARD_THEMES.map((t) => ({
        id: t.value,
        label: t.label,
        primary: '#abc',
        bg: '#123',
      })),
    );

    expect(options).toHaveLength(STANDARD_THEMES.length);
    expect(options.map((o) => o.id)).toEqual(STANDARD_THEMES.map((t) => t.value));
    expect(options.map((o) => o.label)).toEqual(STANDARD_THEMES.map((t) => t.label));
    expect(options[0]).toEqual({
      id: 'default',
      label: 'Linear',
      previewBg: '#123',
      previewAccent: '#abc',
    });
  });
});
