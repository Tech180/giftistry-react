import type { ReactNode } from 'react';
import type { Item } from '../../../../../interfaces/item.interface';

export interface Props {
  items: Item[];
  allowGroupFunds: boolean;
  isTaggingModeActive: boolean;
  isOwner: boolean;
  currentUserId?: string | null;
  canShowTrailingActions?: boolean;
  className?: string;
  id?: string;
  children: (item: Item) => ReactNode;
}
