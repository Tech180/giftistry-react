import { ListParticipant } from '../../../../../../interfaces/list-participant.interface';

export interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  onSubmit: (e: React.SyntheticEvent) => void;
}
