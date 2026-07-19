import React from 'react';
import { Star, Link2, Edit2, Trash2, Tag, ExternalLink } from 'lucide-react';
import { Button, Card } from 'shared/ui';
import { LinksWidget, FundingWidget, AiReviewsPanel, ClaimPrompt } from '../item-presentation';
import { ItemShowcaseTemplateProps } from '../../interfaces/item-showcase-template-props.interface';
import styles from './item-showcase.module.css';

export const ItemShowcaseTemplate: React.FC<ItemShowcaseTemplateProps> = ({
  item,
  priorityLabel,
  isOwner,
  canCollaborate,
  isExpired,
  allowGroupFunds,
  wishlistItems,
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
  setClaimQty,
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
  totalClaimedQty,
  desiredQtyVal,
  isFullyClaimed,
  progressPercent,
  onClose,
  onEdit,
  getSiteName,
  reviews,
  reviewsLoading,
  reviewsError,
  aiEnabled,
  canShowAi,
  audienceLabel,
  isPrivate,
  linkedItems,
  variant,
  CategoryIcon,
  categoryLabel,
}) => {
  const isLinkedToItems = linkedItems.length > 0;

  if (variant === 'inline') {
    return (
      <div className={`${styles['showcase-inline']} ${isPrivate ? styles['private-item'] : ''}`}>
        {/* Detail Hero Header */}
        <div className={styles['detail-hero']}>
          <span className={styles['category-badge']}>
            {CategoryIcon && <CategoryIcon size={12} style={{ marginRight: '4px' }} />}
            {categoryLabel || item.Category || 'General'}
          </span>
          <h2 className={styles['detail-title']}>{item.Name}</h2>
          <span className={styles['detail-price']}>
            {totalExtractedPrice > 0 ? `$${totalExtractedPrice.toFixed(2)}` : '—'}
          </span>
        </div>

        {/* Inspector Body */}
        <div className={styles['inspector-body']}>
          {/* Notes & Description */}
          {displayDescription ? (
            <div className={styles['detail-section']}>
              <span className={styles['section-label']}>Notes & Description</span>
              <p className={styles['detail-text']}>{displayDescription}</p>
            </div>
          ) : (
            <div className={styles['detail-section']}>
              <span className={styles['section-label']}>Notes & Description</span>
              <p className={styles['description-box-empty']}>No description provided for this item.</p>
            </div>
          )}

          {/* AI Reviews Section */}
          {canShowAi && aiEnabled && item.Links && item.Links.length > 0 && (
            <AiReviewsPanel
              reviews={reviews}
              reviewsLoading={reviewsLoading}
              reviewsError={reviewsError}
            />
          )}

          {/* Custom metadata fields */}
          {predefinedDisplayEntries.length > 0 ? (
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
          ) : null}

          {userDefinedEntries.map((field, idx) => (
            <div key={idx} className={styles['detail-section']}>
              <span className={styles['section-label']}>{field.name}</span>
              <p className={styles['detail-text']}>{field.value}</p>
            </div>
          ))}

          {/* Variations progress */}
          {isMultiCount && metadata?.Variations && metadata.Variations.length > 0 && (
            <div className={styles['detail-section']}>
              <span className={styles['section-label']}>Variations Progress</span>
              <div className={styles['variations-progress-list']}>
                {metadata.Variations.map((v: any, idx: number) => {
                  const claimed = item.Claims.filter(c => c.Selection === v.Name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                  const percent = Math.min(100, Math.round((claimed / v.Quantity) * 100));
                  return (
                    <div key={idx} className={styles['variation-progress-card']}>
                      <div className={styles['variation-progress-header']}>
                        <span className={styles['variation-name']}>{v.Name}</span>
                        <span className={styles['variation-qty']}>{claimed} / {v.Quantity} Claimed</span>
                      </div>
                      <div className={styles['progress-bar-bg-mini']}>
                        <div className={styles['progress-bar-fill-mini']} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Properties Grid: Priority & Status */}
          <div className={styles['detail-section']}>
            <span className={styles['section-label']}>Properties</span>
            <div className={styles['property-grid']}>
              <div className={styles['prop-card']}>
                <div className={styles['prop-label']}>Priority</div>
                <div className={styles['prop-value']}>{priorityLabel || 'None'}</div>
              </div>
              <div className={styles['prop-card']}>
                <div className={styles['prop-label']}>Status</div>
                <div
                  className={styles['prop-value']}
                  style={{ color: isFullyClaimed ? 'var(--success)' : 'inherit' }}
                >
                  {isFullyClaimed ? 'Claimed' : 'Available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspector Footer */}
        <div className={styles['inspector-footer']} style={{ flexDirection: 'column', gap: '8px' }}>
          {item.Links && item.Links[0] && (
            <a
              href={item.Links[0].Url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['buy-button']}
            >
              <span>Buy at {getSiteName(item.Links[0].Url, item.Links[0].RetailerName)}</span>
              <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
            </a>
          )}

          {/* Action Buttons Row */}
          <div className={styles['action-btn-row']}>
            {!isOwner ? (
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
                  <Button
                    variant="secondary"
                    className={styles['claim-button']}
                    disabled={true}
                  >
                    Already Claimed
                  </Button>
                ) : (
                  <div className={styles['claim-widget']}>
                    {showClaimForm ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleClaim();
                        }}
                        className={styles['claim-form']}
                      >
                        <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
                        {isMultiCount && metadata?.Variations && metadata.Variations.length > 0 && (
                          <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Choose Variation</label>
                            <select
                              value={selectedVariation}
                              onChange={(e) => setSelectedVariation(e.target.value)}
                              className={styles['variation-select']}
                            >
                              {metadata.Variations.map((v: any, idx: number) => {
                                const claimed = item.Claims.filter(c => c.Selection === v.Name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                                const remaining = Math.max(0, v.Quantity - claimed);
                                return (
                                  <option key={idx} value={v.Name} disabled={remaining <= 0}>
                                    {v.Name} ({remaining} remaining)
                                  </option>
                                );
                              })}
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
                              onChange={(e) => setClaimQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              style={{ width: '80px' }}
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
                              max={totalExtractedPrice - totalClaimedAmount}
                              value={claimAmount}
                              onChange={(e) => setClaimAmount(e.target.value)}
                              placeholder="Enter contribution amount"
                              required
                            />
                          </div>
                        )}
                        <div className={styles['form-actions']}>
                          <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            isLoading={claimLoading}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowClaimForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
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
                {canCollaborate && (
                  <div className={styles['owner-actions']}>
                    <Button variant="secondary" className={styles['owner-btn']} onClick={onEdit}>
                      <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                    </Button>
                    {showDeleteConfirm ? (
                      <div className={styles['delete-confirm-widget']}>
                        <span className={styles['confirm-prompt']}>Delete?</span>
                        <div className={styles['confirm-buttons']}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleDelete}
                            isLoading={deleteLoading}
                          >
                            Yes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(false)}
                          >
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
                        <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles['owner-actions']}>
                <Button variant="secondary" className={styles['owner-btn']} onClick={onEdit}>
                  <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                </Button>
                {showDeleteConfirm ? (
                  <div className={styles['delete-confirm-widget']}>
                    <span className={styles['confirm-prompt']}>Delete?</span>
                    <div className={styles['confirm-buttons']}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDelete}
                        isLoading={deleteLoading}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
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
                    <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {showDependencyModal && (
          <div className={styles['modal-overlay']}>
            <Card className={styles['dependency-modal']} glass={true}>
              <h3 className={styles['modal-title']}>🔗 Connected Gift Items</h3>
              <p className={styles['modal-text']}>
                This gift is linked to other items in the wishlist. Would you like to claim them all at once?
              </p>
              <div className={styles['linked-items-preview-list']}>
                {linkedItems.map((linkedItem) => (
                  <div key={linkedItem.Id} className={styles['linked-item-preview-row']}>
                    <span className={styles['linked-item-name']}>{linkedItem.Name}</span>
                    <span className={linkedItem.IsClaimed ? styles['linked-item-status-claimed'] : styles['linked-item-status-available']}>
                      {linkedItem.IsClaimed ? 'Already Claimed' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles['modal-actions']}>
                <Button
                  variant="primary"
                  onClick={handleBulkClaim}
                  isLoading={claimLoading}
                >
                  Claim All Unclaimed
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleClaim(undefined, true)}
                  isLoading={claimLoading}
                >
                  Claim Selected Only
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDependencyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${styles['showcase-card']} ${isPrivate ? styles['private-item'] : ''}`} padding="none" glass={true}>
      <div className={styles['showcase-header']}>
        <div className={styles['showcase-title-area']}>
          <div className={styles['showcase-meta-line']}>
            <span className={styles['showcase-category']}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {item.Category || 'General'}
            </span>
          </div>
          <h3 className={styles['showcase-title']}>
            {isLinkedToItems && (
              <Link2 size={16} className={styles['linked-item-icon']} aria-hidden="true" />
            )}
            {item.Name}
          </h3>
          {(item.IsHiddenIdea && !item.IsSuggestion) && (
            <span className={styles['status-badge']}>Collaborator Suggestion (Hidden from list owner)</span>
          )}
          {item.IsSuggestion && (
            <span className={styles['status-badge']}>
              Suggestion by {item.SuggestedByUsername || 'Collaborator'}
            </span>
          )}
          {audienceLabel && (
            <span className={`${styles['audience-badge']} ${isPrivate ? styles['private-audience-badge'] : ''}`}>
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
          <button onClick={onClose} className={styles['close-btn']} title="Close Preview">
            &times;
          </button>
        </div>
      </div>

      <div className={styles['showcase-body']}>
        <div className={styles['showcase-grid']}>
          {/* Left Column: Info & Description */}
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

            {/* AI Reviews Section */}
            {canShowAi && aiEnabled && item.Links && item.Links.length > 0 && (
              <AiReviewsPanel
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                reviewsError={reviewsError}
              />
            )}

            {/* Custom metadata fields */}
            {predefinedDisplayEntries.length > 0 ? (
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
            ) : null}

            {userDefinedEntries.map((field, idx) => (
              <div key={idx} className={styles['description-box']}>
                <h4 className={styles['section-title']}>{field.name}</h4>
                <p className={styles['description-text']}>{field.value}</p>
              </div>
            ))}

            {/* Variations progress */}
            {isMultiCount && metadata?.Variations && metadata.Variations.length > 0 && (
              <div className={styles['variations-section']}>
                <h4 className={styles['section-title']}>Variations Progress</h4>
                <div className={styles['variations-progress-list']}>
                  {metadata.Variations.map((v: any, idx: number) => {
                    const claimed = item.Claims.filter(c => c.Selection === v.Name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                    const percent = Math.min(100, Math.round((claimed / v.Quantity) * 100));
                    return (
                      <div key={idx} className={styles['variation-progress-card']}>
                        <div className={styles['variation-progress-header']}>
                          <span className={styles['variation-name']}>{v.Name}</span>
                          <span className={styles['variation-qty']}>{claimed} / {v.Quantity} Claimed</span>
                        </div>
                        <div className={styles['progress-bar-bg-mini']}>
                          <div className={styles['progress-bar-fill-mini']} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Links, and Funding */}
          <div className={styles['action-col']}>
            <div className={styles['price-container']}>
              <span className={styles['price-label']}>Best Price</span>
              <span className={styles['price-value']}>
                {totalExtractedPrice > 0 ? `$${totalExtractedPrice}` : '—'}
              </span>
            </div>

            {/* Progress Bar for Group Funding / Multi-Count Items */}
            {isMultiCount ? (
              <div className={styles['funding-section']}>
                <div className={styles['funding-header']}>
                  <span>Quantities Claimed</span>
                  <span>{progressPercent}% ({totalClaimedQty} / {desiredQtyVal})</span>
                </div>
                <div className={styles['progress-bar-bg']}>
                  <div className={styles['progress-bar-fill']} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              allowGroupFunds && totalExtractedPrice > 0 && (
                <FundingWidget
                  totalExtractedPrice={totalExtractedPrice}
                  totalClaimedAmount={totalClaimedAmount}
                  label="Group Funding Progress"
                />
              )
            )}

            {/* Purchase Links */}
            <div className={styles['links-section']}>
              <h4 className={styles['section-title']}>Purchase Links</h4>
              <LinksWidget links={item.Links} getSiteName={getSiteName} />
            </div>

            {/* Action Buttons */}
            <div className={styles['actions-area']}>
              {!isOwner ? (
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
                    <Button
                      variant="secondary"
                      className={styles['claim-button']}
                      disabled={true}
                    >
                      Already Claimed
                    </Button>
                  ) : (
                    <div className={styles['claim-widget']}>
                    {showClaimForm ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleClaim();
                        }}
                        className={styles['claim-form']}
                      >
                        <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
                        {isMultiCount && metadata?.Variations && metadata.Variations.length > 0 && (
                          <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Choose Variation</label>
                            <select
                              value={selectedVariation}
                              onChange={(e) => setSelectedVariation(e.target.value)}
                              className={styles['variation-select']}
                            >
                              {metadata.Variations.map((v: any, idx: number) => {
                                const claimed = item.Claims.filter(c => c.Selection === v.Name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                                const remaining = Math.max(0, v.Quantity - claimed);
                                return (
                                  <option key={idx} value={v.Name} disabled={remaining <= 0}>
                                    {v.Name} ({remaining} remaining)
                                  </option>
                                );
                              })}
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
                              onChange={(e) => setClaimQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              style={{ width: '80px' }}
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
                              max={totalExtractedPrice - totalClaimedAmount}
                              value={claimAmount}
                              onChange={(e) => setClaimAmount(e.target.value)}
                              placeholder="Enter contribution amount"
                              required
                            />
                          </div>
                        )}
                        <div className={styles['form-actions']}>
                          <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            isLoading={claimLoading}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowClaimForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
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
                  {canCollaborate && (
                    <div className={styles['owner-actions']}>
                      <Button variant="secondary" className={styles['owner-btn']} onClick={onEdit}>
                        <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                      </Button>
                      {showDeleteConfirm ? (
                        <div className={styles['delete-confirm-widget']}>
                          <span className={styles['confirm-prompt']}>Delete?</span>
                          <div className={styles['confirm-buttons']}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleDelete}
                              isLoading={deleteLoading}
                            >
                              Yes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(false)}
                            >
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
                          <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles['owner-actions']}>
                  <Button variant="secondary" className={styles['owner-btn']} onClick={onEdit}>
                    <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                  </Button>
                  {showDeleteConfirm ? (
                    <div className={styles['delete-confirm-widget']}>
                      <span className={styles['confirm-prompt']}>Delete?</span>
                      <div className={styles['confirm-buttons']}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleDelete}
                          isLoading={deleteLoading}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
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
                      <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDependencyModal && (
        <div className={styles['modal-overlay']}>
          <Card className={styles['dependency-modal']} glass={true}>
            <h3 className={styles['modal-title']}>🔗 Connected Gift Items</h3>
            <p className={styles['modal-text']}>
              This gift is linked to other items in the wishlist. Would you like to claim them all at once?
            </p>
            <div className={styles['linked-items-preview-list']}>
              {linkedItems.map((linkedItem) => (
                <div key={linkedItem.Id} className={styles['linked-item-preview-row']}>
                  <span className={styles['linked-item-name']}>{linkedItem.Name}</span>
                  <span className={linkedItem.IsClaimed ? styles['linked-item-status-claimed'] : styles['linked-item-status-available']}>
                    {linkedItem.IsClaimed ? 'Already Claimed' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles['modal-actions']}>
              <Button
                variant="primary"
                onClick={handleBulkClaim}
                isLoading={claimLoading}
              >
                Claim All Unclaimed
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleClaim(undefined, true)}
                isLoading={claimLoading}
              >
                Claim Selected Only
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDependencyModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};
