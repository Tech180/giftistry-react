import type { Comment } from './comment.interface';

export interface FindCommentInTreeResult {
  comment: Comment;
  parentId: string | null;
}
