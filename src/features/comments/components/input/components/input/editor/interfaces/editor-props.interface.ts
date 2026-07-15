import { ListParticipant } from '../../../../../../interfaces/list-participant.interface';

export interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  isOwner?: boolean;
  isOwnerVisible?: boolean;
  listOwnerId?: string;
  onSubmit: (e: React.SyntheticEvent) => void;
}
