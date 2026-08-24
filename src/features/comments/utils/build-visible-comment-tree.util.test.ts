import { describe, expect, test } from 'vitest';
import type { Comment } from '../interfaces/comment.interface';
import { buildVisibleCommentTree } from './build-visible-comment-tree.util';

const base = {
  ListId: 'list-1',
  UserId: 'user-1',
  CommenterName: 'Alex',
  IsOwnerVisible: true,
  IsRollover: false,
} as const;

const comments: Comment[] = [
  {
    ...base,
    Id: 'p1',
    Content: 'alive',
    ParentId: null,
    IsDeleted: false,
    CreatedAt: '2024-01-01T00:00:00Z',
  },
  {
    ...base,
    Id: 'p2',
    Content: 'gone',
    ParentId: null,
    IsDeleted: true,
    CreatedAt: '2024-01-02T00:00:00Z',
  },
  {
    ...base,
    Id: 'r1',
    Content: 'reply alive',
    ParentId: 'p1',
    IsDeleted: false,
    CreatedAt: '2024-01-03T00:00:00Z',
  },
  {
    ...base,
    Id: 'r2',
    Content: 'reply gone',
    ParentId: 'p1',
    IsDeleted: true,
    CreatedAt: '2024-01-04T00:00:00Z',
  },
];

describe('buildVisibleCommentTree', () => {
  test('hides deleted parents and replies by default', () => {
    const { parentComments, repliesMap } = buildVisibleCommentTree(comments, false);

    expect(parentComments.map((c) => c.Id)).toEqual(['p1']);
    expect(repliesMap.p1?.map((c) => c.Id)).toEqual(['r1']);
    expect(repliesMap.p2).toBeUndefined();
  });

  test('includes deleted comments when enabled', () => {
    const { parentComments, repliesMap } = buildVisibleCommentTree(comments, true);

    expect(parentComments.map((c) => c.Id)).toEqual(['p1', 'p2']);
    expect(repliesMap.p1?.map((c) => c.Id)).toEqual(['r1', 'r2']);
  });
});
