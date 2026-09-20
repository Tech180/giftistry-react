import type { Friend } from '../../../interfaces/friend.interface';

export interface Props {
  friends: Friend[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}
