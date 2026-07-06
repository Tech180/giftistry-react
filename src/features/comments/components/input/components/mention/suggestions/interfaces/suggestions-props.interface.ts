import { ListParticipant } from '../../../../../../interfaces/list-participant.interface';

export interface SuggestionsProps {
  candidates: ListParticipant[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (index: number) => void;
}
