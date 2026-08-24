import type { Comment } from '../interfaces/comment.interface';

function isVisibleComment(comment: Comment, showDeletedComments: boolean): boolean {
  return showDeletedComments || !comment.IsDeleted;
}

/**
 * Builds parent/reply trees, optionally omitting soft-deleted comments.
 */
export function buildVisibleCommentTree(
  comments: Comment[],
  showDeletedComments: boolean
): {
  parentComments: Comment[];
  repliesMap: Record<string, Comment[]>;
} {
  const visible = comments.filter((comment) => isVisibleComment(comment, showDeletedComments));

  const parentComments = visible.filter((comment) => !comment.ParentId);

  const repliesMap: Record<string, Comment[]> = {};
  for (const comment of visible) {
    if (!comment.ParentId) continue;
    if (!repliesMap[comment.ParentId]) {
      repliesMap[comment.ParentId] = [];
    }
    repliesMap[comment.ParentId].push(comment);
  }

  for (const parentId of Object.keys(repliesMap)) {
    repliesMap[parentId].sort(
      (a, b) => new Date(a.CreatedAt ?? 0).getTime() - new Date(b.CreatedAt ?? 0).getTime()
    );
  }

  return { parentComments, repliesMap };
}
