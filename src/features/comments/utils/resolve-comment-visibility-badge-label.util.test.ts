import { describe, expect, test } from 'vitest';
import { resolveCommentVisibilityBadgeLabel } from './resolve-comment-visibility-badge-label.util';

describe('resolveCommentVisibilityBadgeLabel', () => {
  test('labels hiddenFromOwner', () => {
    expect(resolveCommentVisibilityBadgeLabel('hiddenFromOwner', 0)).toBe('Invisible to Owner');
  });

  test('labels visibleToSelected with count', () => {
    expect(resolveCommentVisibilityBadgeLabel('visibleToSelected', 3)).toBe('Visible to 3');
  });

  test('labels visibleToSelected with empty selection', () => {
    expect(resolveCommentVisibilityBadgeLabel('visibleToSelected', 0)).toBe('Selected audience');
  });

  test('labels visibleToAll', () => {
    expect(resolveCommentVisibilityBadgeLabel('visibleToAll', 0)).toBe('Visible to Owner');
  });
});
