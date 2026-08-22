import type { Comment } from '../interfaces/comment.interface';

export function appendUniqueComment(comments: Comment[], comment: Comment): Comment[] {
  if (comment.Id && comments.some((existing) => existing.Id === comment.Id)) {
    return comments;
  }
  return [...comments, comment];
}
