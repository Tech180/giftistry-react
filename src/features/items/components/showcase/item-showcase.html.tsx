import React from 'react';
import { Star, Link2, Edit2, Trash2, Tag, Layers2 } from 'lucide-react';
import { Button, Card } from 'shared/ui';
// Future: AI item reviews — re-enable AiReviewsPanel when shipping the feature.
// import { LinksWidget, FundingWidget, AiReviewsPanel, ClaimPrompt } from '../item-presentation';
import { LinksWidget, FundingWidget, ClaimPrompt, QuantityBadge } from '../item-presentation';
import type { ItemShowcaseTemplateProps } from '../../interfaces/item-showcase-template-props.interface';
import { getItemPrimaryImageUrl } from '../../utils/item-primary-image.util';
import styles from './item-showcase.module.css';

export const ItemShowcaseTemplate: React.FC<ItemShowcaseTemplateProps> = ({
  item,
  isOwner,
  canCollaborate,
  isArchived = false,
  allowGroupFunds,
  claimedByCurrentUser,
  claimAmount,
  setClaimAmount,
  anonymous,
  setAnonymous,
  claimLoading,
  showClaimForm,
  setShowClaimForm,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteLoading,
  localIsFavorite,
  selectedVariation,
  setSelectedVariation,
  claimQty,
  onClaimQtyInputChange,
  showDependencyModal,
  setShowDependencyModal,
  displayDescription,
  metadata,
  predefinedDisplayEntries,
  userDefinedEntries,
  metadataBadgeEmoji,
  handleClaim,
  handleBulkClaim,
  handleUnclaim,
  handleDelete,
  totalExtractedPrice,
  totalClaimedAmount,
  isMultiCount,
  isFullyClaimed,
  progressPercent,
  onClose,
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
  variationOptions,
  linkedRelationItems,
  relatedRelationItems,
  maxContributionAmount,
}) => {
  const primaryImageUrl = getItemPrimaryImageUrl(item);

  const claimForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleClaim();
      }}
      className={styles['claim-form']}
    >
      <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
      {isMultiCount && variationOptions.length > 0 && (
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>Choose Variation</label>
          <select
            value={selectedVariation}
            onChange={(e) => setSelectedVariation(e.target.value)}
            className={styles['variation-select']}
          >
            {variationOptions.map((option) => (
              <option key={option.name} value={option.name} disabled={option.disabled}>
                {option.optionLabel}
              </option>
            ))}
          </select>
        </div>
      )}
      {isMultiCount && (
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>Quantity to Claim</label>
          <input
            type="number"
            min="1"
            value={claimQty}
            onChange={(e) => onClaimQtyInputChange(e.target.value)}
            className={styles['qty-input']}
            required
          />
        </div>
      )}
      {!isMultiCount && allowGroupFunds && (
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>Amount to Contribute</label>
          <input
            type="number"
            step="0.01"
            max={maxContributionAmount}
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="Enter contribution amount"
            required
          />
        </div>
      )}
      <div className={styles['form-actions']}>
        <Button variant="primary" size="sm" type="submit" isLoading={claimLoading}>
          Confirm
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  const ownerActions = (
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

  const guestActions = isArchived ? null : !isOwner ? (
    <>
      {claimedByCurrentUser ? (
        <Button
          variant="secondary"
          className={styles['claim-button']}
          onClick={handleUnclaim}
          isLoading={claimLoading}
        >
          Unclaim Item
        </Button>
      ) : isFullyClaimed ? (
        <Button variant="secondary" className={styles['claim-button']} disabled>
          Already Claimed
        </Button>
      ) : (
        <div className={styles['claim-widget']}>
          {showClaimForm ? (
            claimForm
          ) : (
            <Button
              variant="primary"
              className={styles['claim-button']}
              onClick={() => setShowClaimForm(true)}
            >
              Claim Item
            </Button>
          )}
        </div>
      )}
      {canCollaborate && ownerActions}
    </>
  ) : (
    ownerActions
  );

  const dependencyModal = showDependencyModal ? (
    <div className={styles['modal-overlay']}>
      <Card className={styles['dependency-modal']} glass={true}>
        <h3 className={styles['modal-title']}>🔗 Connected Gift Items</h3>
        <p className={styles['modal-text']}>
          This gift is linked to other items in the wishlist. Would you like to claim them all at once?
        </p>
        <div className={styles['linked-items-preview-list']}>
          {linkedRelationItems.map((linkedItem) => (
            <div key={linkedItem.id} className={styles['linked-item-preview-row']}>
              <span className={styles['linked-item-name']}>{linkedItem.name}</span>
              <span
                className={
                  linkedItem.statusLabel === 'Claimed'
                    ? styles['linked-item-status-claimed']
                    : styles['linked-item-status-available']
                }
              >
                {linkedItem.statusLabel === 'Claimed' ? 'Already Claimed' : 'Available'}
              </span>
            </div>
          ))}
        </div>
        <div className={styles['modal-actions']}>
          <Button variant="primary" onClick={handleBulkClaim} isLoading={claimLoading}>
            Claim All Unclaimed
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleClaim(undefined, true)}
            isLoading={claimLoading}
          >
            Claim Selected Only
          </Button>
          <Button variant="ghost" onClick={() => setShowDependencyModal(false)}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  ) : null;

  if (variant === 'inline') {
    return (
      <div className={`${styles['showcase-inline']} ${isPrivate ? styles['private-item'] : ''} ${isArchived ? styles['archived-item'] : ''}`}>
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
            {item.Name}
          </h2>
          <div className={styles['detail-price-row']}>
            <QuantityBadge item={item} metadata={metadata} />
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
                    <div className={styles['prop-label']}>Priority</div>
                    <div className={styles['prop-value']}>
                      {priorityDisplay}
                      <span className={styles['prop-value-hint']}> (1 is highest)</span>
                    </div>
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

          {item.Links.length > 0 && (
            <div className={styles['detail-section']}>
              <span className={styles['section-label']}>Purchase links</span>
              <LinksWidget links={item.Links} getSiteName={getSiteName} />
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

        <div className={styles['inspector-footer']}>
          <div className={styles['action-btn-row']}>{guestActions}</div>
        </div>

        {dependencyModal}
      </div>
    );
  }

  return (
    <Card className={`${styles['showcase-card']} ${isPrivate ? styles['private-item'] : ''} ${isArchived ? styles['archived-item'] : ''}`} padding="none" glass={true}>
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
            {item.Name}
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
              <LinksWidget links={item.Links} getSiteName={getSiteName} />
            </div>

            <div className={styles['actions-area']}>{guestActions}</div>
          </div>
        </div>
      </div>

      {dependencyModal}
    </Card>
  );
};
