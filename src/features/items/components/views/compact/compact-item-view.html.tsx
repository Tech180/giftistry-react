import React from 'react';
import { Star, Link2, Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from 'app/providers/auth-context';
import { Button, EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  ClaimPrompt,
  FundingWidget,
  MetadataGrid,
  SharingAvatars,
  TaggingOverlay,
  TaggingSelect,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getPrimaryClaimForBadge, getClaimedGrayOutClass, getUserClaimedHighlightClass, shouldShowClaimBadge } from '../shared/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import styles from './compact-item-view.module.css';

export const CompactItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    canCollaborate,
    allowGroupFunds,
    isFullyClaimed,
    totalExtractedPrice,
    totalClaimedAmount,
    showClaimForm,
    setShowClaimForm,
    anonymous,
    setAnonymous,
    claimLoading,
    handleClaim,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteLoading,
    handleDelete,
    isFavorite,
    toggleFavorite,
    onEdit,
    claimedByCurrentUser,
    handleUnclaim,
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    isExpanded,
    setIsExpanded,
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadataBadgeEmoji,
    getSiteName,
    audienceLabel,
    isPrivate,
    linkedItems,
    isLinkingContext,
  } = props;

  const { user } = useAuth();
  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const primaryClaim = getPrimaryClaimForBadge(item.Claims);
  const primaryLink = item.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
  const sharingUsers = item.SharedWith ?? [];

  const modifierClass = buildItemCardModifierClasses(
    {
      isPrivate,
      isFullyClaimed,
      claimedByCurrentUser,
      isOwner,
      isTaggedSelection,
    },
    styles
  );
  const showClaimBadge = shouldShowClaimBadge(primaryClaim, claimedByCurrentUser);
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    primaryClaim != null,
    claimedByCurrentUser,
    styles
  );
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );

  return (
    <div
      className={`${styles['v-compact-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass} ${isExpanded ? styles.expanded : ''}`}
      aria-expanded={isExpanded}
    >
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <div
        className={styles['v-compact-row']}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('input')) return;
          setIsExpanded?.(!isExpanded);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded?.(!isExpanded);
          }
        }}
      >
        {hasPriorityValue(item.Priority) && (
          <div
            className={styles['v-compact-priority-rail']}
            title={`Priority ${item.Priority} (1 is highest)`}
            aria-label={`Priority ${item.Priority}`}
          >
            {item.Priority}
          </div>
        )}
        <div
          className={`${styles['v-compact-row-main']} ${isTaggingModeActive ? styles.tagging : ''}`}
        >
        {isTaggingModeActive && (
          <div className={styles['v-compact-select']}>
            <TaggingSelect
              isTaggingModeActive={isTaggingModeActive}
              isTaggedSelection={isTaggedSelection}
              onSelectTag={onSelectTag}
            />
          </div>
        )}

        <div className={styles['v-compact-star']}>
          {isOwner ? (
            <button
              type="button"
              onClick={toggleFavorite}
              className={styles['v-compact-star-btn']}
              title="Toggle favorite"
            >
              <Star
                size={16}
                fill={isFavorite ? 'var(--warning)' : 'none'}
                stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
              />
            </button>
          ) : isFavorite ? (
            <Star size={16} fill="var(--warning)" stroke="var(--warning)" />
          ) : (
            <Star size={16} fill="none" stroke="currentColor" style={{ opacity: 0.3 }} />
          )}
          {isLinkedToItems && (
            <Link2
              size={14}
              className={styles['linked-icon']}
              aria-label="Linked to other items"
            />
          )}
        </div>

        <div className={styles['v-compact-main']}>
          <span className={styles['v-compact-title']} title={item.Name}>
            {item.Name}
          </span>
          <div className={styles['v-compact-meta-sub']}>
            {predefinedDisplayEntries.slice(0, 2).map((entry) => (
              <span key={entry.label}>
                {entry.label}: {entry.value}
              </span>
            ))}
            <Badges
              item={item}
              audienceLabel={showSharingAvatars ? null : audienceLabel}
              isPrivate={isPrivate}
              showPriority={false}
            />
          </div>
        </div>

        <div className={styles['v-compact-funding']}>
          {allowGroupFunds && totalExtractedPrice > 0 && (
            <FundingWidget
              totalExtractedPrice={totalExtractedPrice}
              totalClaimedAmount={totalClaimedAmount}
              label=""
            />
          )}
        </div>

        <div className={styles['v-compact-link']}>
          {primaryLink ? (
            <a
              href={primaryLink.Url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={getSiteName(primaryLink.Url, primaryLink.RetailerName)}
              aria-label={`Open ${getSiteName(primaryLink.Url, primaryLink.RetailerName)}`}
            >
              <LinkIcon size={12} aria-hidden />
              <span className={styles['v-compact-link-label']}>
                {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
              </span>
            </a>
          ) : (
            <span className={styles['v-compact-no-link']}>No link</span>
          )}
        </div>

        <div className={styles['v-compact-price']}>
          <span>{primaryPrice != null ? `$${primaryPrice}` : '—'}</span>
        </div>

        <div className={styles['v-compact-claim-badge']}>
          {showSharingAvatars && (
            <SharingAvatars users={sharingUsers} isOwner={isOwner} />
          )}
          {showClaimBadge && (
            <ClaimBadge
              userId={primaryClaim.userId}
              displayName={primaryClaim.displayName}
              anonymous={primaryClaim.anonymous}
            />
          )}
        </div>

        <div className={styles['v-compact-actions']}>
          {!isOwner && (
            claimedByCurrentUser ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnclaim();
                }}
                disabled={claimLoading}
                className={styles['v-compact-action-btn']}
              >
                Unclaim
              </button>
            ) : isFullyClaimed ? (
              <button
                type="button"
                className={styles['v-compact-action-btn']}
                disabled
              >
                Claimed
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClaimForm(true);
                }}
                className={styles['v-compact-action-btn']}
              >
                Claim
              </button>
            )
          )}
          {canCollaborate && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className={styles['v-compact-action-btn']}
                title="Edit Item"
                aria-label="Edit item"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className={styles['v-compact-action-btn']}
                title="Delete Item"
                aria-label="Delete item"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
        </div>
      </div>

      {showClaimForm && (
        <EnterPanel animation="dropdown" className={styles['confirm-extension']}>
          <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
          <div className={styles['confirm-buttons']}>
            <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
              Yes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
              Cancel
            </Button>
          </div>
        </EnterPanel>
      )}

      {showDeleteConfirm && (
        <EnterPanel animation="dropdown" className={styles['confirm-extension']}>
          <span>Delete this item?</span>
          <div className={styles['confirm-buttons']}>
            <Button variant="primary" size="sm" onClick={handleDelete} isLoading={deleteLoading}>
              Yes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              No
            </Button>
          </div>
        </EnterPanel>
      )}

      {isExpanded && (
        <div className={styles['v-compact-expanded']}>
          <div className={styles['v-compact-expanded-content']}>
            <div className={styles['expanded-desc-col']}>
              {displayDescription && (
                <p className={styles['expanded-desc']}>{displayDescription}</p>
              )}
            </div>
            <MetadataGrid
              predefinedDisplayEntries={predefinedDisplayEntries}
              userDefinedEntries={userDefinedEntries}
              metadataBadgeEmoji={metadataBadgeEmoji}
              variant="compact"
            />
          </div>
          {allowGroupFunds && (
            <div className={styles['v-compact-expanded-aside']}>
              <FundingWidget
                totalExtractedPrice={totalExtractedPrice}
                totalClaimedAmount={totalClaimedAmount}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
