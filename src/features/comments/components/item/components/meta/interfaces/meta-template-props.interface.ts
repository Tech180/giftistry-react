import { Comment } from '../../../../../interfaces/comment.interface';
import { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface MetaTemplateProps {
  comment: Comment;
  isAnonymousComment: boolean;
  isSystemComment?: boolean;
  authorUsername: string | null;
  authorAvatar: string | null;
  authorParticipant?: ListParticipant;
  isOnline: boolean;
  isListOwnerComment: boolean;
  formatDate: (dateStr?: string) => string;
  datePart: string;
  timePart: string;
}
