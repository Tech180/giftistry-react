import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Card } from 'shared/ui';
import { WishlistCardTemplateProps } from '../../interfaces/wishlist-card-template-props.interface';
import styles from './wishlist-card.module.css';

export const WishlistCardTemplate: React.FC<WishlistCardTemplateProps> = ({
  wishlist,
  isOwner,
  formattedDate,
  expirationClass,
}) => {
  return (
    <Card className={styles.card} hoverable={true} padding="none">
      <Link to={`/wishlists/${wishlist.Id}`} className={styles.linkWrapper}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{wishlist.Title}</h3>
            <span className={`${styles.badge} ${isOwner ? styles.ownerBadge : styles.sharedBadge}`}>
              {isOwner ? 'Owner' : 'Shared'}
            </span>
          </div>

          <div className={styles.meta}>
            <div className={`${styles.metaItem} ${expirationClass}`}>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>

            {wishlist.AllowGroupFunds && (
              <div className={styles.metaItem}>
                <Users size={14} />
                <span>Group Funding Enabled</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.footer}>
          <span className={styles.viewLink}>View Wishlist</span>
          <ArrowRight size={14} className={styles.arrow} />
        </div>
      </Link>
    </Card>
  );
};
