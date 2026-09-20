import { describe, expect, test } from 'vitest';
import type { PublicLinkPreview } from 'features/wishlists';
import { normalizePreview } from './normalize-preview.util';

describe('invite-accept utils', () => {
  test('normalizePreview maps empty Items and Groups', () => {
    const preview = {
      Wishlist: {
        Id: 'list-1',
        Title: 'Test',
        ExpiresAt: null,
        IsActive: true,
        AllowGroupFunds: false,
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
      Items: undefined,
      Groups: undefined,
    } as unknown as PublicLinkPreview;

    const result = normalizePreview(preview);
    expect(result.Items).toEqual([]);
    expect(result.Groups).toEqual([]);
  });

  test('normalizePreview normalizes nested group items', () => {
    const preview = {
      Wishlist: {
        Id: 'list-1',
        Title: 'Test',
        ExpiresAt: null,
        IsActive: true,
        AllowGroupFunds: false,
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
      Items: [{ Id: 'item-1', Name: 'Gift' }],
      Groups: [
        {
          Key: 'g1',
          Label: 'Group',
          Items: [{ Id: 'item-2', Name: 'Nested' }],
        },
      ],
    } as unknown as PublicLinkPreview;

    const result = normalizePreview(preview);
    expect(result.Items).toHaveLength(1);
    expect(result.Items[0].Name).toBe('Gift');
    expect(result.Items[0].IsHiddenIdea).toBe(false);
    expect(result.Groups[0].Items).toHaveLength(1);
    expect(result.Groups[0].Items[0].Name).toBe('Nested');
  });
});
