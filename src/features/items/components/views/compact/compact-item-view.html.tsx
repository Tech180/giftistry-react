import React from 'react';
import { Star, Link2, Link as LinkIcon, Pencil, Trash2, Layers2, Eye } from 'lucide-react';
import { useAuth } from 'app/providers/auth-context';
import { EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  ClaimPrompt,
  ClaimForm,
  FundingWidget,
  MetadataGrid,
  SharingAvatars,
  TaggingOverlay,
  TaggingSelect,
  QuantityBadge,
  PriorityDisplay,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getClaimedGrayOutClass, getUserClaimedHighlightClass } from '../shared/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import styles from './compact-item-view.module.css';

export const CompactItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    canCollaborate,
    isPublicGuest = false,
    canEditItem,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
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
    canAdjustClaim = false,
    itemActions,
    claimUserId,
    claimActorName,
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    isExpanded,
    setIsExpanded,
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadataBadgeEmoji,
    metadata,
    getSiteName,
    audienceLabel,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    isSelected,
    onSelect,
    onView,
  } = props;

  const { user } = useAuth();
  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryLink = item.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(item);
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
  const sharingUsers = item.SharedWith ?? [];
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(item.Claims, claimUserId, claimedByCurrentUser, claimActorName);

  const modifierClass = buildItemCardModifierClasses(
    {
      isPrivate,
      isFullyClaimed,
      claimedByCurrentUser,
      isOwner,
      isSuggestion: !!item.IsSuggestion,
      isTaggedSelection,
      isSelected,
    },
    styles
  );
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    hasVisibleClaim,
    claimedByCurrentUser,
    styles,
    props.isArchived,
    isMultiCount
  );
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );
  const showCompactActions =
    !isPublicGuest &&
    (canCollaborate || !isOwner || canEditItem) &&
    !props.isArchived &&
    !props.isExpired;
  const hasPriority = hasPriorityValue(item.Priority);

  return (
    <div
      className={`${styles['v-compact-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass} ${isExpanded ? styles.expanded : ''} ${isSelected ? styles['is-selected'] : ''}`}
      aria-expanded={isExpanded}
    >
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <div className={styles['v-compact-card-inner']}>
        <div className={styles['v-compact-card-body']}>
      <div
        className={styles['v-compact-row']}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('input')) return;
          onSelect?.();
          setIsExpanded?.(!isExpanded);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.();
            setIsExpanded?.(!isExpanded);
          }
        }}
      >
        <div className={styles['v-compact-leading']}>
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
          {isRelatedToItems && (
            <Layers2
              size={14}
              className={styles['linked-icon']}
              aria-label="Related to other items"
            />
          )}
        </div>

        {hasPriority && (
          <PriorityDisplay
            priority={item.Priority as number}
            variant="compact"
            className={styles['v-compact-priority-rail']}
          />
        )}
        </div>

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

        <div className={styles['v-compact-claim-badge']}>
          {showSharingAvatars && (
            <SharingAvatars users={sharingUsers} isOwner={isOwner} />
          )}
          {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
          {item.IsSuggestion && (
            <SuggestionBadge
              userId={item.SuggestedByUserId}
              displayName={item.SuggestedByUsername || 'Collaborator'}
            />
          )}
        </div>
        </div>

        <div className={styles['v-compact-trailing']}>
          <div className={styles['v-compact-price']}>
            <div className={styles['v-compact-price-row']}>
              <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
              <span>{primaryPrice != null ? `$${primaryPrice}` : '—'}</span>
            </div>
          </div>

          {primaryLink && (
            <div className={styles['v-compact-link']}>
              <a
                href={primaryLink.Url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                aria-label={`Open ${getSiteName(primaryLink.Url, primaryLink.RetailerName)}`}
                className={styles['v-compact-action-btn']}
              >
                <LinkIcon size={14} aria-hidden />
              </a>
            </div>
          )}

          {(onView || showCompactActions) && (
            <div className={styles['v-compact-actions']}>
            {onView && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className={styles['v-compact-action-btn']}
                title="View Item"
                aria-label="View item"
              >
                <Eye size={14} />
              </button>
            )}
            {showCompactActions && (canEditItem ?? canCollaborate) && (
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
                  className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-danger']}`}
                  title="Delete Item"
                  aria-label="Delete item"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            {showCompactActions && !isOwner && !showClaimForm && (
              claimedByCurrentUser && !canAdjustClaim ? (
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
              ) : claimedByCurrentUser && canAdjustClaim ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnclaim();
                    }}
                    disabled={claimLoading}
                    className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-danger']}`}
                  >
                    Unclaim All
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClaimForm(true);
                    }}
                    className={styles['v-compact-action-btn']}
                  >
                    Update
                  </button>
                </>
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
            </div>
          )}
        </div>
      </div>

      {showClaimForm && !props.isArchived && !props.isExpired && (
        <EnterPanel
          animation="dropdown"
          className={
            canAdjustClaim ? styles['confirm-extension-stack'] : styles['confirm-extension']
          }
        >
          {itemActions ? (
            <ClaimForm
              item={item}
              metadata={item.Metadata}
              userId={claimUserId}
              claimedByName={claimActorName ?? null}
              itemActions={itemActions}
              anonymous={anonymous}
              onAnonymousChange={setAnonymous}
              onSubmitted={() => setShowClaimForm(false)}
              onCancel={() => setShowClaimForm(false)}
              compact
            />
          ) : (
            <>
              <div className={styles['confirm-prompt']}>
                <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
              </div>
              <div className={styles['confirm-buttons']}>
                <button
                  type="button"
                  onClick={() => handleClaim()}
                  disabled={claimLoading}
                  className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-wide']} ${styles['v-compact-action-btn-primary']}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-wide']}`}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </EnterPanel>
      )}

      {showDeleteConfirm && !props.isArchived && !props.isExpired && (
        <EnterPanel animation="dropdown" className={styles['confirm-extension']}>
          <div className={styles['confirm-prompt']}>
            <span>Delete this item?</span>
          </div>
          <div className={styles['confirm-buttons']}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-wide']} ${styles['v-compact-action-btn-primary']}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-wide']}`}
            >
              No
            </button>
          </div>
        </EnterPanel>
      )}

      {isExpanded && (
        <div className={styles['v-compact-expanded']}>
          <div
            className={`${styles['v-compact-expanded-content']} ${primaryImageUrl ? styles['has-photo'] : ''}`}
          >
            {primaryImageUrl && (
              <div className={styles['expanded-photo-col']}>
                <img
                  src={primaryImageUrl}
                  alt=""
                  className={styles['expanded-photo']}
                />
              </div>
            )}
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
      </div>
    </div>
  );
};
