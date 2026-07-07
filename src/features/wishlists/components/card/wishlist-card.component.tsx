import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { WishlistCardProps } from '../../interfaces/wishlist-card-props.interface';
import { WishlistCardTemplate } from './wishlist-card.html';
import styles from './wishlist-card.module.css';
import { isWishlistExpired } from '../../utils/is-wishlist-expired.util';
import { formatWishlistCardDate } from 'shared/utils/format-date.util';

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, isArchived = false }) => {
  const { user } = useAuth();
  const isOwner = user?.Id === wishlist.UserId;
  const [isSharesSidebarOpen, setIsSharesSidebarOpen] = React.useState(false);
  const [sidebarPage, setSidebarPage] = React.useState(0);
  const pageSize = 3;

  const onToggleSharesSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharesSidebarOpen((prev) => {
      if (!prev) setSidebarPage(0);
      return !prev;
    });
  };

  const onSidebarPageUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSidebarPage((prev) => Math.max(0, prev - 1));
  };

  const onSidebarPageDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const totalShares = wishlist.Shares?.length || 0;
    const maxPage = Math.max(0, Math.ceil(totalShares / pageSize) - 1);
    setSidebarPage((prev) => Math.min(maxPage, prev + 1));
  };

  const getExpirationClass = (dateStr: string | null) => {
    if (!dateStr) return styles['no-expire'];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return styles['no-expire'];
    return isWishlistExpired(dateStr) ? styles.expired : styles['active-expire'];
  };

  return (
    <WishlistCardTemplate
      wishlist={wishlist}
      isOwner={isOwner}
      formattedDate={formatWishlistCardDate(wishlist.ExpiresAt)}
      expirationClass={getExpirationClass(wishlist.ExpiresAt)}
      isArchived={isArchived}
      isPersonalShared={wishlist.Role === 'owner' || !wishlist.Role}
      isSharesSidebarOpen={isSharesSidebarOpen}
      onToggleSharesSidebar={onToggleSharesSidebar}
      sidebarPage={sidebarPage}
      onSidebarPageUp={onSidebarPageUp}
      onSidebarPageDown={onSidebarPageDown}
      pageSize={pageSize}
    />
  );
};
