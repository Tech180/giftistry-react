import { Item } from '../../../features/items/interfaces/item.interface';

export interface CommentInputTemplateProps {
  isOwner: boolean;
  isOwnerVisible: boolean;
  setIsOwnerVisible: (visible: boolean) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  commenterName: string;
  setCommenterName: (name: string) => void;
  isSubmitLoading: boolean;
  handleSubmit: (e: React.SyntheticEvent) => void;
  items: Item[];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  typingUsers: string[];
  isAnonymous: boolean;
  setIsAnonymous: (anonymous: boolean) => void;
}
