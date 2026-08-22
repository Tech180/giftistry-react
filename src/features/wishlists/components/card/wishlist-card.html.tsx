import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Archive, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { UserAvatar, UserPreviewCard } from 'shared/ui';
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
  isSharesSidebarOpen,
  onToggleSharesSidebar,
  sidebarPage,
  onSidebarPageUp,
  onSidebarPageDown,
  pageSize,
}) => {
  const hasShares = wishlist.Shares && wishlist.Shares.length > 0;

  return (
    <div
      className={`${styles.shell} ${isSharesSidebarOpen ? styles['shell-active'] : ''}`}
    >
      <Link
        to={`/wishlists/${wishlist.Id}`}
        className={styles['link-wrapper']}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles['category-pill']}>
              <WishlistCategoryIcon category={wishlist.Category} className={styles['category-icon']} />
              <span className={styles['category-name']}>{wishlist.Category || 'generic'}</span>
            </div>

            {(isArchived && isOwner && isPersonalShared) && (
              <div className={styles['header-actions']}>
                <span className={`${styles.badge} ${styles.personal}`}>
                  Personal
                </span>
              </div>
            )}
          </div>

          <div className={styles['title-area']}>
            <h3 className={styles.title}>{wishlist.Title}</h3>

            {!isOwner && wishlist.OwnerFirstName && (
              <div className={styles['owner-attribution']}>
                <span>by {wishlist.OwnerFirstName}</span>
                <UserPreviewCard
                  userId={wishlist.UserId}
                  displayName={wishlist.OwnerUsername || wishlist.OwnerFirstName}
                  fallbackUser={{
                    Username: wishlist.OwnerUsername,
                    FirstName: wishlist.OwnerFirstName,
                    Avatar: wishlist.OwnerAvatar,
                  }}
                >
                  <UserAvatar
                    avatar={wishlist.OwnerAvatar}
                    alt={wishlist.OwnerUsername || wishlist.OwnerFirstName}
                    initials={(wishlist.OwnerFirstName[0] || wishlist.OwnerUsername?.[0] || 'U').toUpperCase()}
                    className={styles['owner-avatar']}
                    imageClassName={styles['owner-avatar-img']}
                    initialsClassName={styles['owner-avatar-initials']}
                  />
                </UserPreviewCard>
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

      {hasShares && (() => {
        const startIdx = sidebarPage * pageSize;
        const endIdx = startIdx + pageSize;
        const pagedShares = wishlist.Shares!.slice(startIdx, endIdx);
        const hasMoreBelow = endIdx < wishlist.Shares!.length;
        const hasMoreAbove = sidebarPage > 0;

        return (
          <div
            className={`${styles['shares-sidebar']} ${isSharesSidebarOpen ? styles['sidebar-open'] : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {hasMoreAbove && (
              <button
                type="button"
                className={styles['sidebar-nav-btn']}
                onClick={onSidebarPageUp}
                aria-label="Scroll up"
              >
                <ChevronUp size={14} />
              </button>
            )}

            <div className={styles['sidebar-list']}>
              {pagedShares.map((share) => {
                const initials = (share.FirstName?.[0] || '') + (share.LastName?.[0] || '');
                const alt = share.Username || 'User';
                return (
                  <div key={share.Id} className={styles['sidebar-item']}>
                    <UserPreviewCard
                      userId={share.UserId}
                      displayName={share.Username || alt}
                      fallbackUser={{
                        Username: share.Username,
                        FirstName: share.FirstName,
                        LastName: share.LastName,
                        Avatar: share.Avatar,
                      }}
                    >
                      <UserAvatar
                        avatar={share.Avatar}
                        alt={alt}
                        initials={initials || alt[0].toUpperCase()}
                        className={styles['sidebar-avatar']}
                        imageClassName={styles['sidebar-avatar-img']}
                        initialsClassName={styles['sidebar-avatar-initials']}
                      />
                    </UserPreviewCard>
                  </div>
                );
              })}
            </div>

            {hasMoreBelow && (
              <button
                type="button"
                className={styles['sidebar-nav-btn']}
                onClick={onSidebarPageDown}
                aria-label="Scroll down"
              >
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        );
      })()}

      {hasShares && (
        <div className={styles['toggle-host']}>
          <button
            type="button"
            className={`${styles['sidebar-toggle-btn']} ${isSharesSidebarOpen ? styles['sidebar-toggle-btn-active'] : ''}`}
            onClick={onToggleSharesSidebar}
            title="View shared users"
            aria-label="View shared users"
            aria-expanded={isSharesSidebarOpen}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
