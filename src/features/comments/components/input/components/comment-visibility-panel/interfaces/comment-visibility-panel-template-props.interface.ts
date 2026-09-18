import type { CommentVisibilityMode } from '../../../../../interfaces/comment-visibility-mode.type';
import type { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface CommentVisibilityPanelTemplateProps {
  isMobile: boolean;
  isOwner: boolean;
  mode: CommentVisibilityMode;
  selectedUserIds: string[];
  participants: ListParticipant[];
  currentUserId?: string;
  listOwnerId?: string;
  onSelectMode: (mode: CommentVisibilityMode) => void;
  onToggleUser: (userId: string) => void;
  onDone: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}
