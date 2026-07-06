import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { WishlistCardProps } from '../../interfaces/wishlist-card-props.interface';
import { WishlistCardTemplate } from './wishlist-card.html';
import styles from './wishlist-card.module.css';
import { isWishlistExpired } from '../../utils/is-wishlist-expired.util';
import { formatWishlistCardDate } from 'shared/utils/format-date.util';

const getAvatarBgColor = (username: string) => {
  const colors = [
    styles['avatar-bg1'],
    styles['avatar-bg2'],
    styles['avatar-bg3'],
    styles['avatar-bg4'],
    styles['avatar-bg5'],
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
      ownerAvatarClass={getAvatarBgColor(wishlist.OwnerUsername || wishlist.OwnerFirstName || '')}
    />
  );
};
