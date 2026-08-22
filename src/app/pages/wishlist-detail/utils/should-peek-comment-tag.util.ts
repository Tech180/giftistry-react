import { CommentTagPeekContext } from '../interfaces/comment-tag-peek-context.interface';

export function shouldPeekCommentTag(context: CommentTagPeekContext): boolean {
  return context.isMobileSheet && context.isCommentsOpen && !context.isCommentTaggingActive;
}
