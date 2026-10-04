import { describe, expect, test } from 'vitest';
import { resolveCommentVisibilityBadgeLabel } from './resolve-comment-visibility-badge-label.util';

describe('resolveCommentVisibilityBadgeLabel', () => {
  test('labels hiddenFromOwner', () => {
    expect(resolveCommentVisibilityBadgeLabel('hiddenFromOwner')).toBe('Invisible to Owner');
  });

  test('labels visibleToSelected', () => {
    expect(resolveCommentVisibilityBadgeLabel('visibleToSelected')).toBe('Selected');
  });

  test('labels visibleToAll', () => {
    expect(resolveCommentVisibilityBadgeLabel('visibleToAll')).toBe('Everyone');
  });
});
