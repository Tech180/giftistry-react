import React from 'react';
import { Link2, Link as LinkIcon } from 'lucide-react';
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
} from '../../item-presentation';
import { buildItemCardModifierClasses, getPrimaryClaimForBadge, getClaimedGrayOutClass, getUserClaimedHighlightClass, shouldShowClaimBadge } from '../shared/item-card-modifiers.util';
import styles from './feed-item-view.module.css';

export const FeedItemView: React.FC<ItemViewProps> = (props) => {
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
  const primaryPrice = primaryLink?.ExtractedPrice;

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
    <article className={styles['v-feed-item']}>
      <div className={`${styles['v-feed-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}>
        <TaggingOverlay
          isTaggingModeActive={isTaggingModeActive}
          isTaggedSelection={isTaggedSelection}
          onSelectTag={onSelectTag}
        />

        <header className={styles['v-feed-header']}>
          <div className={styles['v-feed-title-wrap']}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isTaggingModeActive && (
                <TaggingSelect
                  isTaggingModeActive={isTaggingModeActive}
                  isTaggedSelection={isTaggedSelection}
                  onSelectTag={onSelectTag}
                />
              )}
              <h3 className={styles['v-feed-title']}>
                {isLinkedToItems && (
                  <Link2 size={16} className={styles['linked-icon']} aria-hidden="true" />
                )}
                {item.Name}
              </h3>
            </div>
            <div className={styles['v-feed-badges']}>
              <Badges
                item={item}
                audienceLabel={audienceLabel}
                isPrivate={isPrivate}
              />
            </div>
          </div>
          <div className={styles['v-feed-header-meta']}>
            {primaryLink && (
              <a
                href={primaryLink.Url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['v-feed-header-link']}
              >
                <LinkIcon size={14} aria-hidden="true" />
                {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
              </a>
            )}
            {(primaryPrice != null || showClaimBadge) && (
              <div className={styles['v-feed-price-row']}>
                {primaryPrice != null && (
                  <span className={styles['v-feed-price']}>${primaryPrice}</span>
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
        </header>

        {displayDescription && (
          <p className={styles['v-feed-desc']}>{displayDescription}</p>
        )}

        <MetadataGrid
          predefinedDisplayEntries={predefinedDisplayEntries}
          userDefinedEntries={userDefinedEntries}
          metadataBadgeEmoji={metadataBadgeEmoji}
        />

        {allowGroupFunds && totalExtractedPrice > 0 && (
          <FundingWidget
            totalExtractedPrice={totalExtractedPrice}
            totalClaimedAmount={totalClaimedAmount}
          />
        )}

        <footer className={styles['v-feed-actions']}>
          {showClaimForm ? (
            <EnterPanel animation="dropdown" className={styles['claim-form-panel']}>
              <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
              <div className={styles['claim-form-actions']}>
                <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
                  Yes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
                  Cancel
                </Button>
              </div>
            </EnterPanel>
          ) : (
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
          )}
        </footer>
      </div>
    </article>
  );
};
