import { describe, expect, test } from 'vitest';
import type { Comment } from '../interfaces/comment.interface';
import { mergeCommentListFromFetch, mergeReactionLists } from './merge-comment-list-from-fetch.util';

const baseComment = (overrides: Partial<Comment> = {}): Comment => ({
  Id: 'c1',
  ListId: 'list-1',
  UserId: 'u1',
  CommenterName: 'Alice',
  Content: 'Hi',
  IsOwnerVisible: true,
  IsRollover: false,
  CreatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('mergeReactionLists', () => {
  test('unions server and local reactions by user and emoji', () => {
    const server = [{ UserId: '1', Username: 'a', Reaction: '👍' }];
    const local = [{ UserId: '2', Username: 'b', Reaction: '❤️' }];

    expect(mergeReactionLists(server, local)).toEqual([
      { UserId: '1', Username: 'a', Reaction: '👍' },
      { UserId: '2', Username: 'b', Reaction: '❤️' },
    ]);
  });

  test('treats user ids as strings when deduping', () => {
    const server = [{ UserId: 1 as unknown as string, Username: 'a', Reaction: '👍' }];
    const local = [{ UserId: '1', Username: 'a', Reaction: '👍' }];

    expect(mergeReactionLists(server, local)).toHaveLength(1);
  });
});

describe('mergeCommentListFromFetch', () => {
  test('preserves local reactions missing from stale fetch payload', () => {
    const fetched = [baseComment({ Reactions: [] })];
    const previous = [
      baseComment({
        Reactions: [{ UserId: 'me', Username: 'Me', Reaction: '🎉' }],
      }),
    ];

    const merged = mergeCommentListFromFetch(fetched, previous);

    expect(merged[0].Reactions).toEqual([
      { UserId: 'me', Username: 'Me', Reaction: '🎉' },
    ]);
  });

  test('returns fetched list when previous is empty', () => {
    const fetched = [baseComment()];
    expect(mergeCommentListFromFetch(fetched, [])).toBe(fetched);
  });
});
