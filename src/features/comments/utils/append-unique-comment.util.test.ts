import { describe, expect, it } from 'vitest';
import { Comment } from '../interfaces/comment.interface';
import { appendUniqueComment } from './append-unique-comment.util';

function comment(id: string): Comment {
  return {
    Id: id,
    ListId: 'list-1',
    UserId: 'user-1',
    CommenterName: 'Ada',
    Content: 'Hello',
    IsOwnerVisible: true,
    IsRollover: false,
  };
}

describe('appendUniqueComment', () => {
  it('appends a comment that is not already in the list', () => {
    const existing = comment('c-1');
    const incoming = comment('c-2');

    expect(appendUniqueComment([existing], incoming)).toEqual([existing, incoming]);
  });

  it('keeps the existing list when the same comment id is already present', () => {
    const existing = [comment('c-1')];
    const duplicate = { ...comment('c-1'), Content: 'Hello again' };

    expect(appendUniqueComment(existing, duplicate)).toBe(existing);
  });
});
