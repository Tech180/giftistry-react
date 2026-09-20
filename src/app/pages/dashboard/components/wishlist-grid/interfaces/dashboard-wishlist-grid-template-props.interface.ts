import type { ReactNode, RefCallback } from 'react';
import type { DashboardCard } from '../../../interfaces/dashboard-card.interface';

export interface DashboardWishlistGridTemplateProps {
  cards: DashboardCard[];
  isLoading: boolean;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDesc: string;
  showCreateAction: boolean;
  columns: number;
  gridRef: RefCallback<HTMLDivElement>;
  onOpenCreate: () => void;
}
