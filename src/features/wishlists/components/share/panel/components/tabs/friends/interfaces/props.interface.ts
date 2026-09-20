import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export interface Props {
  listId: string;
  shares: ListShare[];
  onSuccess?: () => void;
  variant?: 'classic' | 'compact';
}
