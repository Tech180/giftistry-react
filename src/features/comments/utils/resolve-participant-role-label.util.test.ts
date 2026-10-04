import { describe, expect, test } from 'vitest';
import { resolveParticipantRoleLabel } from './resolve-participant-role-label.util';

describe('resolveParticipantRoleLabel', () => {
  test('uses an explicit role', () => {
    expect(resolveParticipantRoleLabel({ userId: 'a', role: 'viewer' }, 'owner-id')).toBe('viewer');
  });

  test('labels the list owner when role is missing', () => {
    expect(resolveParticipantRoleLabel({ userId: 'owner-id' }, 'owner-id')).toBe('owner');
  });

  test('labels everyone else as a member', () => {
    expect(resolveParticipantRoleLabel({ userId: 'a' })).toBe('member');
  });
});
