import type { CommentVisibilityMode } from '../../../../../interfaces/comment-visibility-mode.type';
import type { AudienceRow } from './audience-row.interface';

export interface TemplateProps {
  isMobile: boolean;
  panelClassName: string;
  isEveryoneActive: boolean;
  showSpoilerWarning: boolean;
  showHiddenFromOwner: boolean;
  isHiddenFromOwnerActive: boolean;
  isChooseWhoActive: boolean;
  isChooseWhoEnabled: boolean;
  chooseWhoDisabledHelp: string;
  audienceRows: AudienceRow[];
  onSelectMode: (mode: CommentVisibilityMode) => void;
  onToggleUser: (userId: string) => void;
  onDone: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}
