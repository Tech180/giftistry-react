import React from 'react';
import { Star, Link2, Edit2, Trash2, Tag, Layers2, Copy } from 'lucide-react';
import { Button, Card } from 'shared/ui';
// Future: AI item reviews — re-enable AiReviewsPanel when shipping the feature.
// import { LinksWidget, FundingWidget, AiReviewsPanel, ClaimPrompt } from '../item-presentation';
import { LinksWidget, FundingWidget, ClaimForm, QuantityBadge, PriorityDisplay, SubstitutionSwitcher, SubstitutionBadge, SubstitutionClaimButton } from '../item-presentation';
import type { ItemShowcaseTemplateProps } from '../../interfaces/item-showcase-template-props.interface';
import { getItemPrimaryImageUrl } from '../../utils/item-primary-image.util';
import {
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../views/shared/item-card-modifiers.util';
import { isItemGroupFundingInProgress } from '../../utils/is-item-group-funding-active.util';
import styles from './item-showcase.module.css';

export const ItemShowcaseTemplate: React.FC<ItemShowcaseTemplateProps> = ({
  item,
  displayItem = item,
  substitutionOptions,
  substitutionActiveIndex,
  onSubstitutionIndexChange,
  substitutionAction = null,
  isOwner,
  canCollaborate,
  isPublicGuest = false,
  canEditItem,
  isArchived = false,
  isExpired = false,
  allowGroupFunds,
  claimedByCurrentUser,
  canAdjustClaim,
  itemActions,
  claimUserId,
  claimActorName,
  claimAmount: _claimAmount,
  setClaimAmount: _setClaimAmount,
  anonymous,
  setAnonymous,
  claimLoading,
  showClaimForm,
  setShowClaimForm,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteLoading,
  localIsFavorite,
  displayDescription,
  metadata,
  predefinedDisplayEntries,
  userDefinedEntries,
  metadataBadgeEmoji,
  handleClaim: _handleClaim,
  handleUnclaim,
  handleDelete,
  totalExtractedPrice,
  totalClaimedAmount,
  isMultiCount,
  isFullyClaimed,
  hasVisibleClaimForGray = false,
  isClaimUnavailable = false,
  progressPercent,
  onClose,
  onCopyMarkdown,
  onEdit,
  getSiteName,
  audienceLabel,
  isPrivate,
  variant,
  CategoryIcon: _CategoryIcon,
  displayCategory,
  bestPriceDisplay,
  statusLabel: _statusLabel,
  quantityProgressMetric,
  hasNumericPriority,
  priorityDisplay,
  isLinkedToItems,
  isRelatedToItems,
  showGroupFunding,
  showQuantityProgress,
  showVariationsProgress,
  showHeroMeta,
  showSuggestionBadge,
  showHiddenSuggestionBadge,
  suggestionLabel,
  variationProgress,
  linkedRelationItems,
  relatedRelationItems,
  maxContributionAmount: _maxContributionAmount,
  linkedClaimPeers = [],
  wishlistItemsForLinkedClaim = [],
  onLinkedClaimItemClick,
}) => {
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);

  const quantityClaimForm = (
    <ClaimForm
      item={displayItem}
      metadata={metadata}
      userId={claimUserId}
      claimedByName={claimActorName}
      itemActions={itemActions}
      anonymous={anonymous}
      onAnonymousChange={setAnonymous}
      onSubmitted={() => setShowClaimForm(false)}
      onCancel={() => setShowClaimForm(false)}
      linkedItems={linkedClaimPeers}
      wishlistItems={wishlistItemsForLinkedClaim}
      onLinkedItemClick={onLinkedClaimItemClick}
      allowGroupFunds={allowGroupFunds}
      fundingTarget={totalExtractedPrice}
      totalClaimedAmount={totalClaimedAmount}
    />
  );

  const claimSectionContent = quantityClaimForm;

  const ownerActions =
    isArchived || isExpired || !onEdit ? null : (
    <div className={styles['owner-actions']}>
      <Button variant="secondary" className={styles['owner-btn']} onClick={onEdit}>
        <Edit2 size={12} className={styles['action-icon']} /> Edit
      </Button>
      {showDeleteConfirm ? (
        <div className={styles['delete-confirm-widget']}>
          <span className={styles['confirm-prompt']}>Delete?</span>
          <div className={styles['confirm-buttons']}>
            <Button variant="primary" size="sm" onClick={handleDelete} isLoading={deleteLoading}>
              Yes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              No
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="secondary"
          className={`${styles['owner-btn']} ${styles['delete-btn']}`}
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={12} className={styles['action-icon']} /> Delete
        </Button>
      )}
    </div>
  );

  const substitutionManageIconClass =
    substitutionAction?.mode === 'manage' ? styles['claim-icon-btn'] : undefined;

  const guestActions =
    isArchived || isExpired || isPublicGuest ? null : !isOwner ? (
    <>
      {(canEditItem ?? canCollaborate) && ownerActions}
      {canAdjustClaim ? (
        isFullyClaimed && !claimedByCurrentUser ? (
          <div className={styles['claim-footer-actions']}>
            {substitutionAction ? (
              <SubstitutionClaimButton
                mode={substitutionAction.mode}
                allowSubstitutions={substitutionAction.allowSubstitutions}
                onOpenEditor={substitutionAction.onRequest}
                onDelete={substitutionAction.onDelete}
                appearance="ghost-text"
                disabled={claimLoading}
                className={substitutionManageIconClass}
              />
            ) : null}
            <Button variant="secondary" className={styles['claim-button']} disabled>
              {isClaimUnavailable ? 'Unavailable' : 'Already Claimed'}
            </Button>
          </div>
        ) : (
          <div className={styles['claim-widget']}>
            {showClaimForm ? (
              claimSectionContent
            ) : (
              <div className={styles['claim-footer-actions']}>
                {substitutionAction ? (
                  <SubstitutionClaimButton
                    mode={substitutionAction.mode}
                    allowSubstitutions={substitutionAction.allowSubstitutions}
                    onOpenEditor={substitutionAction.onRequest}
                    onDelete={substitutionAction.onDelete}
                    appearance="ghost-text"
                    disabled={claimLoading}
                    className={substitutionManageIconClass}
                  />
                ) : null}
                {claimedByCurrentUser && (
                  <Button
                    variant="ghost"
                    className={`${styles['claim-button']} ${styles['unclaim-all-btn']}`}
                    onClick={handleUnclaim}
                    isLoading={claimLoading}
                  >
                    Unclaim All
                  </Button>
                )}
                <Button
                  variant={claimedByCurrentUser ? 'secondary' : 'primary'}
                  className={styles['claim-button']}
                  onClick={() => setShowClaimForm(true)}
                >
                  {claimedByCurrentUser ? 'Update Claim' : 'Claim Item'}
                </Button>
              </div>
            )}
          </div>
        )
      ) : claimedByCurrentUser ? (
        <div className={styles['claim-footer-actions']}>
          {substitutionAction ? (
            <SubstitutionClaimButton
              mode={substitutionAction.mode}
              allowSubstitutions={substitutionAction.allowSubstitutions}
              onOpenEditor={substitutionAction.onRequest}
              onDelete={substitutionAction.onDelete}
              appearance="ghost-text"
                    disabled={claimLoading}
              className={substitutionManageIconClass}
            />
          ) : null}
          <Button
            variant="secondary"
            className={styles['claim-button']}
            onClick={handleUnclaim}
            isLoading={claimLoading}
          >
            Unclaim Item
          </Button>
        </div>
      ) : isFullyClaimed ? (
        <div className={styles['claim-footer-actions']}>
          {substitutionAction ? (
            <SubstitutionClaimButton
              mode={substitutionAction.mode}
              allowSubstitutions={substitutionAction.allowSubstitutions}
              onOpenEditor={substitutionAction.onRequest}
              onDelete={substitutionAction.onDelete}
              appearance="ghost-text"
                    disabled={claimLoading}
              className={substitutionManageIconClass}
            />
          ) : null}
          <Button variant="secondary" className={styles['claim-button']} disabled>
            {isClaimUnavailable ? 'Unavailable' : 'Already Claimed'}
          </Button>
        </div>
      ) : (
        <div className={styles['claim-widget']}>
          {showClaimForm ? (
            claimSectionContent
          ) : (
            <div className={styles['claim-footer-actions']}>
              {substitutionAction ? (
                <SubstitutionClaimButton
                  mode={substitutionAction.mode}
                  allowSubstitutions={substitutionAction.allowSubstitutions}
                  onOpenEditor={substitutionAction.onRequest}
                  onDelete={substitutionAction.onDelete}
                  appearance="ghost-text"
                  disabled={claimLoading}
                  className={substitutionManageIconClass}
                />
              ) : null}
              <Button
                variant="primary"
                className={styles['claim-button']}
                onClick={() => setShowClaimForm(true)}
              >
                Claim Item
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  ) : (
    ownerActions
  );

  const isGroupFundingInProgress = isItemGroupFundingInProgress({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
    isFullyClaimed,
  });
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    hasVisibleClaimForGray,
    claimedByCurrentUser,
    styles,
    isArchived,
    isMultiCount,
    isGroupFundingInProgress
  );
  const groupFundingClass = getGroupFundingInProgressClass(isGroupFundingInProgress, styles);
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );
  const claimChromeClass = [claimedGrayClass, groupFundingClass, userClaimedHighlightClass]
    .filter(Boolean)
    .join(' ');

  if (variant === 'inline') {
    return (
      <div
        className={`${styles['showcase-inline']} ${isPrivate ? styles['private-item'] : ''} ${isArchived ? styles['archived-item'] : ''} ${claimChromeClass}`}
      >
        <SubstitutionSwitcher
          parent={item}
          options={substitutionOptions}
          userId={claimUserId}
          activeIndex={substitutionActiveIndex}
          onActiveIndexChange={onSubstitutionIndexChange}
        >
          {(active) => (
            <>
              {primaryImageUrl && (
                <div className={styles['detail-photo']}>
                  <img src={primaryImageUrl} alt="" className={styles['detail-photo-img']} />
                </div>
              )}
              <div className={styles['detail-hero']}>
                <h2 className={styles['detail-title']}>
                  {isLinkedToItems && (
                    <Link2 size={16} className={styles['linked-item-icon']} aria-hidden="true" />
                  )}
                  {isRelatedToItems && (
                    <Layers2 size={16} className={styles['linked-item-icon']} aria-label="Related to other items" />
                  )}
                  {displayItem.Name}
                  {active.kind !== 'original' ? (
                    <SubstitutionBadge
                      kind={active.kind}
                      createdByUserId={active.option?.CreatedByUserId}
                    />
                  ) : null}
                </h2>
                <div className={styles['detail-price-row']}>
                  <QuantityBadge item={displayItem} metadata={metadata} isOwner={isOwner} />
                  <span className={styles['detail-price']}>{bestPriceDisplay}</span>
                </div>
                {showHeroMeta && (
                  <div className={styles['detail-hero-meta']}>
                    {showSuggestionBadge && (
                      <span className={styles['status-badge']}>{suggestionLabel}</span>
                    )}
                    {showHiddenSuggestionBadge && (
                      <span className={styles['status-badge']}>Hidden suggestion</span>
                    )}
                    {audienceLabel && (
                      <span
                        className={`${styles['audience-badge']} ${isPrivate ? styles['private-audience-badge'] : ''}`}
                      >
                        {audienceLabel}
                      </span>
                    )}
                    {localIsFavorite && (
                      <span className={styles['detail-star-icon']} title="Favorite">
                        <Star size={14} fill="currentColor" aria-hidden />
                        Favorite
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles['inspector-body']}>
                {(hasNumericPriority || audienceLabel) && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Properties</span>
                    <div className={styles['property-grid']}>
                      {hasNumericPriority && priorityDisplay != null && (
                        <div className={styles['prop-card']}>
                          <PriorityDisplay
                            priority={priorityDisplay}
                            variant="stacked"
                            showHint
                            className={styles['prop-card-priority']}
                          />
                        </div>
                      )}
                      {audienceLabel && (
                        <div className={styles['prop-card']}>
                          <div className={styles['prop-label']}>Visibility</div>
                          <div className={styles['prop-value']}>{audienceLabel}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles['detail-section']}>
                  <span className={styles['section-label']}>Notes & Description</span>
                  {displayDescription ? (
                    <p className={styles['detail-text']}>{displayDescription}</p>
                  ) : (
                    <p className={styles['description-box-empty']}>No description provided for this item.</p>
                  )}
                </div>

                {predefinedDisplayEntries.length > 0 && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Details / Sizing</span>
                    <div className={styles['meta-badges']}>
                      {predefinedDisplayEntries.map((entry) => (
                        <span key={entry.label} className={styles['meta-badge']}>
                          {metadataBadgeEmoji[entry.label] ? `${metadataBadgeEmoji[entry.label]} ` : ''}
                          {entry.label}: {entry.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {userDefinedEntries.map((field) => (
                  <div key={field.name} className={styles['detail-section']}>
                    <span className={styles['section-label']}>{field.name}</span>
                    <p className={styles['detail-text']}>{field.value}</p>
                  </div>
                ))}

                {showGroupFunding && (
                  <div className={styles['detail-section']}>
                    <FundingWidget
                      totalExtractedPrice={totalExtractedPrice}
                      totalClaimedAmount={totalClaimedAmount}
                      label="Group funding"
                    />
                  </div>
                )}

                {showVariationsProgress && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Variations</span>
                    <div className={styles['variations-progress-list']}>
                      {variationProgress.map((variation) => (
                        <div key={variation.name} className={styles['variation-progress-card']}>
                          <div className={styles['variation-progress-header']}>
                            <span className={styles['variation-name']}>{variation.name}</span>
                            <span className={styles['variation-qty']}>{variation.qtyLabel}</span>
                          </div>
                          <div className={styles['progress-bar-bg-mini']}>
                            <div
                              className={styles['progress-bar-fill-mini']}
                              style={{ width: `${variation.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {displayItem.Links.length > 0 && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Purchase links</span>
                    <LinksWidget links={displayItem.Links} getSiteName={getSiteName} />
                  </div>
                )}

                {isLinkedToItems && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Linked items</span>
                    <ul className={styles['relation-list']}>
                      {linkedRelationItems.map((linked) => (
                        <li key={linked.id} className={styles['relation-list-item']}>
                          <span>{linked.name}</span>
                          <span className={styles['relation-list-status']}>{linked.statusLabel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isRelatedToItems && (
                  <div className={styles['detail-section']}>
                    <span className={styles['section-label']}>Related items</span>
                    <ul className={styles['relation-list']}>
                      {relatedRelationItems.map((related) => (
                        <li key={related.id} className={styles['relation-list-item']}>
                          <span>{related.name}</span>
                          <span className={styles['relation-list-status']}>{related.statusLabel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </SubstitutionSwitcher>

        <div className={styles['inspector-footer']}>
          <div className={styles['action-btn-row']}>{guestActions}</div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`${styles['showcase-card']} ${isPrivate ? styles['private-item'] : ''} ${isArchived ? styles['archived-item'] : ''} ${claimChromeClass}`} padding="none" glass={true}>
      <SubstitutionSwitcher
        parent={item}
        options={substitutionOptions}
        userId={claimUserId}
        activeIndex={substitutionActiveIndex}
        onActiveIndexChange={onSubstitutionIndexChange}
      >
        {(active) => (
          <>
            {primaryImageUrl && (
              <div className={styles['detail-photo']}>
                <img src={primaryImageUrl} alt="" className={styles['detail-photo-img']} />
              </div>
            )}
            <div className={styles['showcase-header']}>
              <div className={styles['showcase-title-area']}>
                <div className={styles['showcase-meta-line']}>
                  <span className={styles['showcase-category']}>
                    <Tag size={12} className={styles['action-icon']} />
                    {displayCategory}
                  </span>
                </div>
                <h3 className={styles['showcase-title']}>
                  {isLinkedToItems && (
                    <Link2 size={16} className={styles['linked-item-icon']} aria-hidden="true" />
                  )}
                  {isRelatedToItems && (
                    <Layers2 size={16} className={styles['linked-item-icon']} aria-label="Related to other items" />
                  )}
                  {displayItem.Name}
                  {active.kind !== 'original' ? (
                    <SubstitutionBadge
                      kind={active.kind}
                      createdByUserId={active.option?.CreatedByUserId}
                    />
                  ) : null}
                </h3>
                {showHiddenSuggestionBadge && (
                  <span className={styles['status-badge']}>
                    Collaborator Suggestion (Hidden from list owner)
                  </span>
                )}
                {showSuggestionBadge && (
                  <span className={styles['status-badge']}>{suggestionLabel}</span>
                )}
                {audienceLabel && (
                  <span
                    className={`${styles['audience-badge']} ${isPrivate ? styles['private-audience-badge'] : ''}`}
                  >
                    {audienceLabel}
                  </span>
                )}
              </div>
              <div className={styles['showcase-header-actions']}>
                {localIsFavorite && (
                  <span className={styles['detail-star-icon']} title="Favorite Item">
                    <Star size={18} fill="currentColor" />
                  </span>
                )}
                {onCopyMarkdown ? (
                  <button
                    type="button"
                    onClick={onCopyMarkdown}
                    className={styles['copy-btn']}
                    title="Copy item as Markdown"
                    aria-label="Copy item as Markdown"
                  >
                    <Copy size={16} />
                  </button>
                ) : null}
                <button type="button" onClick={onClose} className={styles['close-btn']} title="Close Preview">
                  &times;
                </button>
              </div>
            </div>

            <div className={styles['showcase-body']}>
              <div className={styles['showcase-grid']}>
                <div className={styles['info-col']}>
                  {displayDescription ? (
                    <div className={styles['description-box']}>
                      <h4 className={styles['section-title']}>Description</h4>
                      <p className={styles['description-text']}>{displayDescription}</p>
                    </div>
                  ) : (
                    <div className={styles['description-box-empty']}>
                      <p>No description provided for this item.</p>
                    </div>
                  )}

                  {predefinedDisplayEntries.length > 0 && (
                    <div className={styles['meta-section']}>
                      <h4 className={styles['section-title']}>Details / Sizing</h4>
                      <div className={styles['meta-badges']}>
                        {predefinedDisplayEntries.map((entry) => (
                          <span key={entry.label} className={styles['meta-badge']}>
                            {metadataBadgeEmoji[entry.label] ? `${metadataBadgeEmoji[entry.label]} ` : ''}
                            {entry.label}: {entry.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {userDefinedEntries.map((field) => (
                    <div key={field.name} className={styles['description-box']}>
                      <h4 className={styles['section-title']}>{field.name}</h4>
                      <p className={styles['description-text']}>{field.value}</p>
                    </div>
                  ))}

                  {showVariationsProgress && (
                    <div className={styles['variations-section']}>
                      <h4 className={styles['section-title']}>Variations Progress</h4>
                      <div className={styles['variations-progress-list']}>
                        {variationProgress.map((variation) => (
                          <div key={variation.name} className={styles['variation-progress-card']}>
                            <div className={styles['variation-progress-header']}>
                              <span className={styles['variation-name']}>{variation.name}</span>
                              <span className={styles['variation-qty']}>{variation.qtyLabel}</span>
                            </div>
                            <div className={styles['progress-bar-bg-mini']}>
                              <div
                                className={styles['progress-bar-fill-mini']}
                                style={{ width: `${variation.percent}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles['action-col']}>
                  <div className={styles['price-container']}>
                    <span className={styles['price-label']}>Price</span>
                    <span className={styles['price-value']}>{bestPriceDisplay}</span>
                  </div>

                  {showQuantityProgress ? (
                    <div className={styles['funding-section']}>
                      <div className={styles['funding-header']}>
                        <span>Quantities Claimed</span>
                        <span>{quantityProgressMetric}</span>
                      </div>
                      <div className={styles['progress-bar-bg']}>
                        <div
                          className={styles['progress-bar-fill']}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    showGroupFunding && (
                      <FundingWidget
                        totalExtractedPrice={totalExtractedPrice}
                        totalClaimedAmount={totalClaimedAmount}
                        label="Group Funding Progress"
                      />
                    )
                  )}

                  <div className={styles['links-section']}>
                    <h4 className={styles['section-title']}>Purchase Links</h4>
                    <LinksWidget links={displayItem.Links} getSiteName={getSiteName} />
                  </div>

                  <div className={styles['actions-area']}>{guestActions}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </SubstitutionSwitcher>
    </Card>
  );
};
