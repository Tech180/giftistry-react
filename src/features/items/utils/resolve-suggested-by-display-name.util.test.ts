import { describe, expect, it } from 'vitest';
import { resolveSuggestedByDisplayName } from './resolve-suggested-by-display-name.util';

describe('resolveSuggestedByDisplayName', () => {
  it('prefers first and last name for initials-friendly display', () => {
    expect(
      resolveSuggestedByDisplayName({
        SuggestedByFirstName: 'tech',
        SuggestedByLastName: 'tech',
        SuggestedByUsername: 'techtech',
      })
    ).toBe('tech tech');
  });

  it('falls back to username when names are empty', () => {
    expect(
      resolveSuggestedByDisplayName({
        SuggestedByFirstName: null,
        SuggestedByLastName: '',
        SuggestedByUsername: 'pat',
      })
    ).toBe('pat');
  });

  it('falls back to Collaborator when nothing is set', () => {
    expect(
      resolveSuggestedByDisplayName({
        SuggestedByFirstName: null,
        SuggestedByLastName: null,
        SuggestedByUsername: null,
      })
    ).toBe('Collaborator');
  });
});
