import { describe, expect, it } from 'vitest';
import { resolveCanEditItem } from './resolve-can-edit-item.util';

describe('resolveCanEditItem', () => {
  it('allows list owners to edit', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: null }, 'user-1', true, false)
    ).toBe(true);
  });

  it('allows the suggestor to edit', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: 'user-1' }, 'user-1', false, false)
    ).toBe(true);
  });

  it('denies other collaborators', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: 'user-1' }, 'user-2', false, false)
    ).toBe(false);
  });

  it('denies public guests even if they suggested', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: 'user-1' }, 'user-1', false, true)
    ).toBe(false);
  });
});
