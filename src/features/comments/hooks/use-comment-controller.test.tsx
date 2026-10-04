import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCommentController } from './use-comment-controller';
import type { Comment } from '../interfaces/comment.interface';

vi.mock('../api/comments.api', () => ({
  commentsApi: {
    listComments: vi.fn(),
    addComment: vi.fn(),
    toggleReaction: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

import { commentsApi } from '../api/comments.api';

const baseComment = (overrides: Partial<Comment> = {}): Comment => ({
  Id: 'comment-1',
  ListId: 'list-1',
  UserId: 'author-1',
  CommenterName: 'Author',
  Content: 'Hello',
  IsOwnerVisible: true,
  IsRollover: false,
  CreatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('useCommentController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('toggleReaction adds a reaction when API reports Added', async () => {
    vi.mocked(commentsApi.toggleReaction).mockResolvedValue({ Added: true });

    const { result } = renderHook(() => useCommentController());

    act(() => {
      result.current.setComments([baseComment()]);
    });

    await act(async () => {
      await result.current.toggleReaction('comment-1', '🎉', 'user-1', 'me');
    });

    expect(result.current.comments[0].Reactions).toEqual([
      { UserId: 'user-1', Username: 'me', Reaction: '🎉' },
    ]);
  });

  test('toggleReaction removes a reaction when API reports not Added', async () => {
    vi.mocked(commentsApi.toggleReaction).mockResolvedValue({ Added: false });

    const { result } = renderHook(() => useCommentController());

    act(() => {
      result.current.setComments([
        baseComment({
          Reactions: [{ UserId: 'user-1', Username: 'me', Reaction: '🎉' }],
        }),
      ]);
    });

    await act(async () => {
      await result.current.toggleReaction('comment-1', '🎉', 'user-1', 'me');
    });

    expect(result.current.comments[0].Reactions).toEqual([]);
  });

  test('toggleReaction does not mutate other comments', async () => {
    vi.mocked(commentsApi.toggleReaction).mockResolvedValue({ Added: true });

    const { result } = renderHook(() => useCommentController());

    act(() => {
      result.current.setComments([
        baseComment({ Id: 'comment-1' }),
        baseComment({ Id: 'comment-2', Content: 'Other' }),
      ]);
    });

    await act(async () => {
      await result.current.toggleReaction('comment-1', '👍', 'user-1', 'me');
    });

    expect(result.current.comments[1].Reactions).toBeUndefined();
  });

  test('fetchComments merges local reactions when list response is stale', async () => {
    let resolveList: (value: Comment[]) => void = () => {};
    vi.mocked(commentsApi.listComments).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        })
    );

    const { result } = renderHook(() => useCommentController());

    act(() => {
      result.current.setComments([
        baseComment({
          Reactions: [{ UserId: 'user-1', Username: 'me', Reaction: '🎉' }],
        }),
      ]);
    });

    act(() => {
      void result.current.fetchComments('list-1');
    });

    await act(async () => {
      resolveList([baseComment({ Reactions: [] })]);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.comments[0].Reactions).toEqual([
      { UserId: 'user-1', Username: 'me', Reaction: '🎉' },
    ]);
  });
});
