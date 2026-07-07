import { CommentReactionGroup } from '../../../../../interfaces/comment-reaction-group.interface';

export interface ReactionsProps {
  commentId: string;
  reactionsMap: Record<string, CommentReactionGroup>;
  toggleReaction?: (commentId: string, reaction: string) => void;
}
