import React from 'react';
import { useAuth } from 'app/providers/AuthContext';
import { WishlistCardProps } from '../../interfaces/wishlist-card-props.interface';
import { WishlistCardTemplate } from './wishlist-card.html';
import styles from './wishlist-card.module.css';

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, isArchived = false }) => {
  const { user } = useAuth();
  const isOwner = user?.Id === wishlist.UserId;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No expiration';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'No expiration';
    
    // Check if expired
    const isExpired = date.getTime() < Date.now();
    const formatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return isExpired ? `Expired (${formatted})` : `Expires ${formatted}`;
  };

  const getExpirationClass = (dateStr: string | null) => {
    if (!dateStr) return styles.noExpire;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return styles.noExpire;
    return date.getTime() < Date.now() ? styles.expired : styles.activeExpire;
  };

  return (
    <WishlistCardTemplate
      wishlist={wishlist}
      isOwner={isOwner}
      formattedDate={formatDate(wishlist.ExpiresAt)}
      expirationClass={getExpirationClass(wishlist.ExpiresAt)}
      isArchived={isArchived}
    />
  );
};
