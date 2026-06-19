import { Comment } from '../../interfaces/comment.interface';
import { Item } from '../../../items/interfaces/item.interface';

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  deletingCommentId: string | null;
  setDeletingCommentId: (commentId: string | null) => void;
}
