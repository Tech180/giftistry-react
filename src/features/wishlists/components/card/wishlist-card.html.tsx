import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Archive } from 'lucide-react';
import { Card } from 'shared/ui';
import { WishlistCardTemplateProps } from '../../interfaces/wishlist-card-template-props.interface';
import { WishlistCategoryIcon } from './wishlist-category-icon.component';
import styles from './wishlist-card.module.css';

export const WishlistCardTemplate: React.FC<WishlistCardTemplateProps> = ({
  wishlist,
  isOwner,
  formattedDate,
  expirationClass,
  isArchived,
  isPersonalShared,
  ownerAvatarClass,
}) => {
  return (
    <Card className={`${styles.card} ${isArchived ? styles.archived : ''}`} hoverable={true} padding="none">
      <Link to={`/wishlists/${wishlist.Id}`} className={styles['link-wrapper']}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles['category-pill']}>
              <WishlistCategoryIcon category={wishlist.Category} className={styles['category-icon']} />
              <span className={styles['category-name']}>{wishlist.Category || 'generic'}</span>
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

          <div className={styles['title-area']}>
            <h3 className={styles.title}>{wishlist.Title}</h3>

            {!isOwner && wishlist.OwnerFirstName && (
              <div className={styles['owner-attribution']}>
                <span>by {wishlist.OwnerFirstName}</span>
                <div className={`${styles['owner-avatar']} ${ownerAvatarClass}`} />
              </div>
            )}
          </div>

          <div className={styles.meta}>
            <div className={`${styles['meta-item']} ${expirationClass}`}>
              {isArchived ? <Archive className={styles['meta-icon']} /> : <Calendar className={styles['meta-icon']} />}
              <span>{isArchived ? `Ended ${formattedDate.replace(/^(Expired |Expires )/, '')}` : formattedDate}</span>
            </div>

            {wishlist.AllowGroupFunds && !isArchived && (
              <div className={styles['meta-item']}>
                <Users className={styles['meta-icon']} />
                <span>Group Funding Enabled</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles['view-link']}>
            {isArchived ? 'View Past Details' : 'Open Wishlist'}
          </span>
          <ArrowRight size={16} className={styles.arrow} />
        </div>
      </Link>
    </Card>
  );
};
