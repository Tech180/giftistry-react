import { describe, expect, test } from 'vitest';
import type { Comment } from '../interfaces/comment.interface';
import { findCommentInTree } from './find-comment-in-tree.util';

const base = {
  ListId: 'list-1',
  UserId: 'user-1',
  CommenterName: 'Alex',
  Content: 'body',
  IsOwnerVisible: true,
  IsRollover: false,
} as const;

const comments: Comment[] = [
  { ...base, Id: 'p1', ParentId: null },
  { ...base, Id: 'r1', ParentId: 'p1' },
];

describe('findCommentInTree', () => {
  test('returns parent with null parentId', () => {
    expect(findCommentInTree(comments, 'p1')).toEqual({
      comment: comments[0],
      parentId: null,
    });
  });

  test('returns reply with parentId', () => {
    expect(findCommentInTree(comments, 'r1')).toEqual({
      comment: comments[1],
      parentId: 'p1',
    });
  });

  test('returns null when missing', () => {
    expect(findCommentInTree(comments, 'missing')).toBeNull();
  });
});
