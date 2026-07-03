import { Comment } from './comment.interface';
import { Item } from 'features/items';

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  deletingCommentId: string | null;
  setDeletingCommentId: (commentId: string | null) => void;
  onlineUsers?: string[];
}
