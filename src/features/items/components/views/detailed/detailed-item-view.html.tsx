import React from 'react';
import { Star, Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  ClaimPrompt,
  MetadataGrid,
  FundingWidget,
  ActionButtons,
  TaggingOverlay,
  TaggingSelect,
  SharingAvatars,
  QuantityBadge,
} from '../../item-presentation';
import {
  buildItemCardModifierClasses,
  getPrimaryClaimForBadge,
  getClaimedGrayOutClass,
  getUserClaimedHighlightClass,
  shouldShowClaimBadge,
} from '../shared/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import { useAuth } from 'app/providers/auth-context';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import styles from './detailed-item-view.module.css';

export const DetailedItemView: React.FC<ItemViewProps> = (props) => {
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
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryClaim = getPrimaryClaimForBadge(item.Claims);
  const primaryLink = item.Links[0];
  const { user } = useAuth();
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(item);
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
  const sharingUsers = item.SharedWith ?? [];
  const showQuantity = resolveItemQuantitySummary(item, metadata).shouldDisplay;

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
    styles,
    props.isArchived
  );
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );

  return (
    <div className={`${styles['v-detailed-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}>
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      {primaryImageUrl && (
        <div className={styles['v-detailed-photo']}>
          <img src={primaryImageUrl} alt="" className={styles['v-detailed-photo-img']} />
        </div>
      )}

      <header className={styles['v-detailed-header']}>
        {hasPriorityValue(item.Priority) && (
          <div
            className={styles['v-detailed-priority-rail']}
            title={`Priority ${item.Priority} (1 is highest)`}
            aria-label={`Priority ${item.Priority}`}
          >
            {item.Priority}
          </div>
        )}
        <div className={styles['v-detailed-header-main']}>
          <div className={styles['v-detailed-card-top']}>
            <div className={styles['v-detailed-title-area']}>
              <div className={styles['v-detailed-title-row']}>
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
              <div className={styles['v-detailed-badges']}>
                {hasPriorityValue(item.Priority) && (
                  <span className={styles['v-detailed-rank-tag']} aria-label={`Priority ${item.Priority}`}>
                    #{item.Priority}
                  </span>
                )}
                <Badges
                  item={item}
                  audienceLabel={showSharingAvatars ? null : audienceLabel}
                  isPrivate={isPrivate}
                  showPriority={false}
                />
              </div>
            </div>
            {(primaryPrice != null || showQuantity) && (
              <div className={styles['v-detailed-price-pin']}>
                <QuantityBadge item={item} metadata={metadata} />
                {primaryPrice != null && (
                  <span className={styles['v-detailed-price']}>${primaryPrice}</span>
                )}
              </div>
            )}
          </div>
          {(primaryLink || showSharingAvatars || showClaimBadge) && (
            <div className={styles['v-detailed-header-meta']}>
              {primaryLink && (
                <a
                  href={primaryLink.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['v-detailed-header-link']}
                >
                  <LinkIcon size={14} aria-hidden="true" />
                  {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                </a>
              )}
              {(showSharingAvatars || showClaimBadge) && (
                <div className={styles['v-detailed-avatar-boxes']}>
                  {showSharingAvatars && <SharingAvatars users={sharingUsers} isOwner={isOwner} />}
                  {showClaimBadge && (
                    <ClaimBadge
                      userId={primaryClaim.userId}
                      displayName={primaryClaim.displayName}
                      anonymous={primaryClaim.anonymous}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className={styles['v-detailed-body']}>
        <div className={styles['v-detailed-main-col']}>
          <div className={styles['v-detailed-desc-row']}>
            <div className={styles['v-detailed-desc-col']}>
              {displayDescription && (
                <p className={styles['v-detailed-desc']}>{displayDescription}</p>
              )}
            </div>
            <MetadataGrid
              predefinedDisplayEntries={predefinedDisplayEntries}
              userDefinedEntries={userDefinedEntries}
              metadataBadgeEmoji={metadataBadgeEmoji}
              variant="compact"
            />
          </div>
        </div>

        <aside className={styles['v-detailed-side-col']}>
          {allowGroupFunds && (
            <FundingWidget
              totalExtractedPrice={totalExtractedPrice}
              totalClaimedAmount={totalClaimedAmount}
            />
          )}
          <div className={styles['v-detailed-actions']}>
            <ActionButtons
              isOwner={isOwner}
              canCollaborate={canCollaborate}
              isArchived={props.isArchived}
              claimedByCurrentUser={claimedByCurrentUser}
              isFullyClaimed={isFullyClaimed}
              claimLoading={claimLoading}
              showDeleteConfirm={showDeleteConfirm}
              deleteLoading={deleteLoading}
              onEdit={onEdit}
              onClaim={() => setShowClaimForm(true)}
              onUnclaim={handleUnclaim}
              onDeleteRequest={() => setShowDeleteConfirm(true)}
              onDeleteConfirm={handleDelete}
              onDeleteCancel={() => setShowDeleteConfirm(false)}
              splitOnMobile
            />
          </div>
        </aside>
      </div>

      {showClaimForm && (
        <EnterPanel animation="dropdown" className={styles['claim-panel']}>
          <div className={styles['claim-panel-main']}>
            <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
          </div>
          <div className={styles['claim-panel-actions']}>
            <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
              Yes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
              Cancel
            </Button>
          </div>
        </EnterPanel>
      )}
    </div>
  );
};
