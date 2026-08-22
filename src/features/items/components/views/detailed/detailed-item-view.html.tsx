import React from 'react';
import { Star, Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import { Button } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  ClaimPrompt,
  MetadataGrid,
  FundingWidget,
  ActionButtons,
  ClaimForm,
  TaggingOverlay,
  TaggingSelect,
  SharingAvatars,
  QuantityBadge,
  shouldShowActionButtons,
  PriorityDisplay,
} from '../../item-presentation';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getUserClaimedHighlightClass,
} from '../shared/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { useAuth } from 'app/providers/auth-context';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import styles from './detailed-item-view.module.css';

export const DetailedItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    canCollaborate,
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
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadata,
    metadataBadgeEmoji,
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

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryLink = item.Links[0];
  const { user } = useAuth();
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(item);
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
  const sharingUsers = item.SharedWith ?? [];
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(item.Claims, claimUserId, claimedByCurrentUser, claimActorName);
  const showActionButtons =
    !!onView ||
    shouldShowActionButtons({
      isOwner,
      canCollaborate,
      claimedByCurrentUser,
      isFullyClaimed,
      canAdjustClaim,
      isPublicGuest: props.isPublicGuest,
      canEditItem: props.canEditItem,
      isArchived: props.isArchived,
      isExpired: props.isExpired,
    });
  const showFundingWidget = allowGroupFunds && totalExtractedPrice > 0;

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

  const drawerClass = [
    styles['claim-drawer'],
    showClaimForm ? styles['claim-drawer-open'] : '',
    showClaimForm && claimedByCurrentUser ? styles['claim-drawer-open-user-claimed'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const footerClass = [
    styles['card-footer'],
    claimedByCurrentUser ? styles['card-footer-user-claimed'] : '',
    showClaimForm ? styles['claim-footer-hidden'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${styles['v-detailed-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}
      onClick={
        onSelect
          ? (e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('a') || target.closest('input')) return;
              onSelect();
            }
          : undefined
      }
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
    >
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <div className={styles['v-detailed-body']}>
        {primaryImageUrl && (
          <div className={styles['v-detailed-photo']}>
            <img src={primaryImageUrl} alt="" className={styles['v-detailed-photo-img']} />
          </div>
        )}
        <div className={styles['v-detailed-content']}>
          <div className={styles['v-detailed-meta-row']}>
            {primaryLink ? (
              <a
                href={primaryLink.Url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['brand-link']}
              >
                {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                <LinkIcon size={12} aria-hidden="true" />
              </a>
            ) : (
              <span />
            )}
            <div className={styles['v-detailed-meta-end']}>
              {showSharingAvatars && <SharingAvatars users={sharingUsers} isOwner={isOwner} />}
              {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
              {item.IsSuggestion && (
                <SuggestionBadge
                  userId={item.SuggestedByUserId}
                  displayName={item.SuggestedByUsername || 'Collaborator'}
                />
              )}
              {hasPriorityValue(item.Priority) && (
                <PriorityDisplay priority={item.Priority} variant="meta" />
              )}
            </div>
          </div>

          <div className={styles['v-detailed-title-row']}>
            <div className={styles['v-detailed-title-cluster']}>
              {isTaggingModeActive && (
                <TaggingSelect
                  isTaggingModeActive={isTaggingModeActive}
                  isTaggedSelection={isTaggedSelection}
                  onSelectTag={onSelectTag}
                />
              )}
              {isOwner ? (
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={`${styles['star-btn']} ${isFavorite ? styles['star-btn-active'] : ''}`}
                  title="Toggle favorite"
                >
                  <Star
                    size={18}
                    fill={isFavorite ? 'var(--warning)' : 'none'}
                    stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                  />
                </button>
              ) : isFavorite ? (
                <span className={styles['star-display']} aria-label="Favorited">
                  <Star size={18} fill="var(--warning)" stroke="var(--warning)" />
                </span>
              ) : null}
              {isLinkedToItems && (
                <Link2
                  size={16}
                  className={styles['linked-icon']}
                  aria-label="Linked to other items"
                />
              )}
              {isRelatedToItems && (
                <Layers2
                  size={16}
                  className={styles['linked-icon']}
                  aria-label="Related to other items"
                />
              )}
              <h3 className={styles['v-detailed-title']}>{item.Name}</h3>
            </div>
            <div className={styles['v-detailed-price-row']}>
              <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
              {primaryPrice != null && (
                <span className={styles['v-detailed-price']}>${primaryPrice}</span>
              )}
            </div>
          </div>

          <div className={styles['v-detailed-badges']}>
            <Badges
              item={item}
              audienceLabel={showSharingAvatars ? null : audienceLabel}
              isPrivate={isPrivate}
              showPriority={false}
            />
          </div>

          {displayDescription && (
            <p className={styles['v-detailed-desc']}>{displayDescription}</p>
          )}

          <MetadataGrid
            predefinedDisplayEntries={predefinedDisplayEntries}
            userDefinedEntries={userDefinedEntries}
            metadataBadgeEmoji={metadataBadgeEmoji}
            variant="compact"
          />

          {showFundingWidget && (
            <FundingWidget
              totalExtractedPrice={totalExtractedPrice}
              totalClaimedAmount={totalClaimedAmount}
            />
          )}
        </div>
      </div>

      {showActionButtons && (
        <footer className={footerClass} hidden={showClaimForm || undefined}>
          <div className={styles['footer-actions']}>
            <ActionButtons
            isOwner={isOwner}
            canCollaborate={canCollaborate}
            isPublicGuest={props.isPublicGuest}
            canEditItem={props.canEditItem}
            isArchived={props.isArchived}
            isExpired={props.isExpired}
            claimedByCurrentUser={claimedByCurrentUser}
              isFullyClaimed={isFullyClaimed}
              canAdjustClaim={canAdjustClaim}
              claimLoading={claimLoading}
              showDeleteConfirm={showDeleteConfirm}
              deleteLoading={deleteLoading}
              onEdit={onEdit}
              onView={onView}
              onClaim={() => setShowClaimForm(true)}
              onUnclaim={handleUnclaim}
              onDeleteRequest={() => setShowDeleteConfirm(true)}
              onDeleteConfirm={handleDelete}
              onDeleteCancel={() => setShowDeleteConfirm(false)}
              splitOnMobile
              unclaimDisabled={showClaimForm}
            />
          </div>
        </footer>
      )}

      <div className={drawerClass}>
        <div className={styles['claim-drawer-inner']}>
          {showClaimForm &&
            !props.isArchived &&
            !props.isExpired &&
            (itemActions ? (
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
              />
            ) : (
              <div className={styles['claim-fallback']}>
                <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
                <div className={styles['claim-fallback-actions']}>
                  <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
                    Yes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
