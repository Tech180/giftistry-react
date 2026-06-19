import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Archive, Cake, TreePine, Heart, List } from 'lucide-react';
import { Card } from 'shared/ui';
import { WishlistCardTemplateProps } from '../../interfaces/wishlist-card-template-props.interface';
import styles from './wishlist-card.module.css';

const CategoryIcon: React.FC<{ category?: string; className?: string }> = ({ category, className }) => {
  switch (category?.toLowerCase()) {
    case 'birthday':
      return <Cake className={className} />;
    case 'holiday':
      return <TreePine className={className} />;
    case 'wedding':
      return <Heart className={className} />;
    default:
      return <List className={className} />;
  }
};

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

export const WishlistCardTemplate: React.FC<WishlistCardTemplateProps> = ({
  wishlist,
  isOwner,
  formattedDate,
  expirationClass,
  isArchived,
}) => {
  const isPersonalShared = wishlist.Role === 'owner' || !wishlist.Role;

  return (
    <Card className={`${styles.card} ${isArchived ? styles.archived : ''}`} hoverable={true} padding="none">
      <Link to={`/wishlists/${wishlist.Id}`} className={styles.linkWrapper}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.categoryPill}>
              <CategoryIcon category={wishlist.Category} className={styles.categoryIcon} />
              <span className={styles.categoryName}>{wishlist.Category || 'generic'}</span>
            </div>

            {!isOwner && wishlist.Role && (
              <span className={`${styles.badge} ${styles[wishlist.Role]}`}>
                {wishlist.Role}
              </span>
            )}
            {isArchived && isOwner && isPersonalShared && (
              <span className={`${styles.badge} ${styles.personal}`}>
                Personal
              </span>
            )}
          </div>

          <div className={styles.titleArea}>
            <h3 className={styles.title}>{wishlist.Title}</h3>
            
            {!isOwner && wishlist.OwnerFirstName && (
              <div className={styles.ownerAttribution}>
                <span>by {wishlist.OwnerFirstName}</span>
                <div className={`${styles.ownerAvatar} ${getAvatarBgColor(wishlist.OwnerUsername || wishlist.OwnerFirstName)}`} />
              </div>
            )}
          </div>

          <div className={styles.meta}>
            <div className={`${styles.metaItem} ${expirationClass}`}>
              {isArchived ? <Archive className={styles.metaIcon} /> : <Calendar className={styles.metaIcon} />}
              <span>{isArchived ? `Ended ${formattedDate.replace(/^(Expired |Expires )/, '')}` : formattedDate}</span>
            </div>

            {wishlist.AllowGroupFunds && !isArchived && (
              <div className={styles.metaItem}>
                <Users className={styles.metaIcon} />
                <span>Group Funding Enabled</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.footer}>
          <span className={styles.viewLink}>
            {isArchived ? 'View Past Details' : 'Open Wishlist'}
          </span>
          <ArrowRight size={16} className={styles.arrow} />
        </div>
      </Link>
    </Card>
  );
};
