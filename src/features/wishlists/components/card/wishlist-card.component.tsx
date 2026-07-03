import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { WishlistCardProps } from '../../interfaces/wishlist-card-props.interface';
import { WishlistCardTemplate } from './wishlist-card.html';
import styles from './wishlist-card.module.css';
import { isWishlistExpired } from '../../utils/is-wishlist-expired.util';
import { formatWishlistCardDate } from 'shared/utils/format-date.util';

const getAvatarBgColor = (username: string) => {
  const colors = [
    styles.avatarBg1,
    styles.avatarBg2,
    styles.avatarBg3,
    styles.avatarBg4,
    styles.avatarBg5,
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, isArchived = false }) => {
  const { user } = useAuth();
  const isOwner = user?.Id === wishlist.UserId;

  const getExpirationClass = (dateStr: string | null) => {
    if (!dateStr) return styles.noExpire;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return styles.noExpire;
    return isWishlistExpired(dateStr) ? styles.expired : styles.activeExpire;
  };

  return (
    <WishlistCardTemplate
      wishlist={wishlist}
      isOwner={isOwner}
      formattedDate={formatWishlistCardDate(wishlist.ExpiresAt)}
      expirationClass={getExpirationClass(wishlist.ExpiresAt)}
      isArchived={isArchived}
      isPersonalShared={wishlist.Role === 'owner' || !wishlist.Role}
      ownerAvatarClass={getAvatarBgColor(wishlist.OwnerUsername || wishlist.OwnerFirstName || '')}
    />
  );
};
