import { Comment } from './comment.interface';
import { Item } from '../../../features/items/interfaces/item.interface';

export interface CommentItemTemplateProps {
  comment: Comment;
  cleanText: string;
  taggedIds: string[];
  isDeleting: boolean;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  setDeletingCommentId: (commentId: string | null) => void;
  onlineUsers?: string[];
}
