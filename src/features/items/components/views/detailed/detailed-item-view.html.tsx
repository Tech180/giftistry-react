import React from 'react';
import { Star, Link2, Link as LinkIcon } from 'lucide-react';
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
import { useAuth } from 'app/providers/auth-context';
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
    getSiteName,
    audienceLabel,
    isPrivate,
    linkedItems,
    isLinkingContext,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const primaryClaim = getPrimaryClaimForBadge(item.Claims);
  const primaryLink = item.Links[0];
  const { user } = useAuth();
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
    <div className={`${styles['v-detailed-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}>
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

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
              <h3 className={styles['v-detailed-title']}>{item.Name}</h3>
            </div>
            <div className={styles['v-detailed-badges']}>
              <Badges
                item={item}
                audienceLabel={showSharingAvatars ? null : audienceLabel}
                isPrivate={isPrivate}
                showPriority={false}
              />
            </div>
          </div>
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
            {(showSharingAvatars || primaryPrice != null || showClaimBadge) && (
              <div className={styles['v-detailed-avatar-boxes']}>
                {showSharingAvatars && <SharingAvatars users={sharingUsers} isOwner={isOwner} />}
                {(primaryPrice != null || showClaimBadge) && (
                  <div className={styles['v-detailed-price-row']}>
                    {primaryPrice != null && (
                      <span className={styles['v-detailed-price']}>${primaryPrice}</span>
                    )}
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
