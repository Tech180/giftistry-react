import React from 'react';
import { Plus } from 'lucide-react';
import { WishlistCard } from 'features/wishlists';
import { Button, EmptyState, LoadingState } from 'shared/ui';
import type { DashboardWishlistGridTemplateProps } from './interfaces/dashboard-wishlist-grid-template-props.interface';
import styles from './dashboard-wishlist-grid.module.css';

export const DashboardWishlistGridTemplate: React.FC<DashboardWishlistGridTemplateProps> = ({
  cards,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  showCreateAction,
  columns,
  gridRef,
  onOpenCreate,
}) => (
  <div className={styles['dashboard-grid']}>
    {isLoading ? (
      <LoadingState message="Loading wishlists..." />
    ) : cards.length > 0 ? (
      <div className={styles['dashboard-grid__items']} ref={gridRef} data-columns={columns}>
        {cards.map(({ wishlist, isArchived, tourTarget }) => (
          <WishlistCard
            key={wishlist.Id}
            wishlist={wishlist}
            isArchived={isArchived}
            tourTarget={tourTarget}
          />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDesc}
        action={
          showCreateAction ? (
            <Button variant="secondary" leftIcon={<Plus size={16} />} onClick={onOpenCreate}>
              Create Registry
            </Button>
          ) : undefined
        }
      />
    )}
  </div>
);
