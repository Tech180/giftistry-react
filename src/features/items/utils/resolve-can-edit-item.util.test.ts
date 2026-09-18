import { describe, expect, it } from 'vitest';
import { resolveCanEditItem } from './resolve-can-edit-item.util';

describe('resolveCanEditItem', () => {
  it('allows collaborators to edit any item', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: null }, 'user-1', true, false)
    ).toBe(true);
  });

  it('allows collaborators to edit another user’s suggestion', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: 'user-1' }, 'user-2', true, false)
    ).toBe(true);
  });

  it('allows a viewer to edit their own suggestion', () => {
    expect(
      resolveCanEditItem({ SuggestedByUserId: 'user-1' }, 'user-1', false, false)
    ).toBe(true);
  });

  it('denies viewers editing another user’s suggestion', () => {
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
