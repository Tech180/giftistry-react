import React from 'react';
import { Star, Link as LinkIcon, Link2, Edit2, Trash2, Tag, Sparkles } from 'lucide-react';
import { Button, Card } from 'shared/ui';
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
  globalAiEnabled,
  audienceLabel,
  isPrivate,
  linkedItems,
}) => {
  const isLinkedToItems = linkedItems.length > 0;

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
            {globalAiEnabled && aiEnabled && item.Links && item.Links.length > 0 && (
              <div className={styles['ai-reviews-box']}>
                <h4 className={styles['section-title']}>
                  <Sparkles size={12} className={styles['sparkles-icon']} />
                  AI Review Synthesis
                </h4>

                {reviewsLoading ? (
                  <div className={styles['ai-reviews-loading']}>
                    <div className={styles['skeleton-pulse']} style={{ height: '16px', marginBottom: '8px', width: '90%' }}></div>
                    <div className={styles['skeleton-pulse']} style={{ height: '16px', marginBottom: '8px', width: '75%' }}></div>
                    <div className={styles['skeleton-pulse']} style={{ height: '16px', width: '50%' }}></div>
                  </div>
                ) : reviewsError ? (
                  <p className={styles['reviews-error-text']}>{reviewsError}</p>
                ) : reviews ? (
                  <>
                    <div className={styles['reviews-summary']}>
                      <p>{reviews.summary}</p>
                    </div>

                    <div className={styles['pros-cons-grid']}>
                      <div className={styles['pros-col']}>
                        <h5 className={styles['pros-title']}>Pros</h5>
                        <ul className={styles['pros-list']}>
                          {reviews.pros.map((pro, index) => (
                            <li key={index} className={styles['pro-item']}>
                              <span className={styles['pro-bullet']}>✓</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={styles['cons-col']}>
                        <h5 className={styles['cons-title']}>Cons</h5>
                        <ul className={styles['cons-list']}>
                          {reviews.cons.map((con, index) => (
                            <li key={index} className={styles['con-item']}>
                              <span className={styles['con-bullet']}>✗</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {reviews.reviews && reviews.reviews.length > 0 && (
                      <div className={styles['quotes-section']}>
                        <h5 className={styles['quotes-title']}>What Buyers Say</h5>
                        <div className={styles['quotes-list']}>
                          {reviews.reviews.map((rev, index) => (
                            <blockquote key={index} className={styles['review-quote']}>
                              "{rev}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles['ai-reviews-box-empty']}>
                    <p>AI Review Synthesis is pending for this product link. It will automatically populate shortly.</p>
                  </div>
                )}
              </div>
            )}

            {/* Custom metadata fields */}
            {metadata && (metadata.shirtSize || metadata.pantsSize || metadata.shoesSize || metadata.socksSize || metadata.color) ? (
              <div className={styles['meta-section']}>
                <h4 className={styles['section-title']}>Details / Sizing</h4>
                <div className={styles['meta-badges']}>
                  {metadata.shirtSize && <span className={styles['meta-badge']}>👕 Shirt: {metadata.shirtSize}</span>}
                  {metadata.pantsSize && <span className={styles['meta-badge']}>👖 Pants: {metadata.pantsSize}</span>}
                  {metadata.shoesSize && <span className={styles['meta-badge']}>👟 Shoes: {metadata.shoesSize}</span>}
                  {metadata.socksSize && <span className={styles['meta-badge']}>🧦 Socks: {metadata.socksSize}</span>}
                  {metadata.color && <span className={styles['meta-badge']}>🎨 Color: {metadata.color}</span>}
                </div>
              </div>
            ) : null}

            {metadata?.custom?.map((f: any, idx: number) => (
              <div key={idx} className={styles['description-box']}>
                <h4 className={styles['section-title']}>{f.name}</h4>
                <p className={styles['description-text']}>{f.value}</p>
              </div>
            ))}

            {/* Variations progress */}
            {isMultiCount && metadata?.variations && metadata.variations.length > 0 && (
              <div className={styles['variations-section']}>
                <h4 className={styles['section-title']}>Variations Progress</h4>
                <div className={styles['variations-progress-list']}>
                  {metadata.variations.map((v: any, idx: number) => {
                    const claimed = item.Claims.filter(c => c.Selection === v.name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                    const percent = Math.min(100, Math.round((claimed / v.quantity) * 100));
                    return (
                      <div key={idx} className={styles['variation-progress-card']}>
                        <div className={styles['variation-progress-header']}>
                          <span className={styles['variation-name']}>{v.name}</span>
                          <span className={styles['variation-qty']}>{claimed} / {v.quantity} Claimed</span>
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
                <div className={styles['funding-section']}>
                  <div className={styles['funding-header']}>
                    <span>Group Funding Progress</span>
                    <span>{progressPercent}% (${totalClaimedAmount} / ${totalExtractedPrice})</span>
                  </div>
                  <div className={styles['progress-bar-bg']}>
                    <div className={styles['progress-bar-fill']} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )
            )}

            {/* Purchase Links */}
            <div className={styles['links-section']}>
              <h4 className={styles['section-title']}>Purchase Links</h4>
              {item.Links.length > 0 ? (
                <div className={styles['links-list']}>
                  {item.Links.map((link) => (
                    <a
                      key={link.Id}
                      href={link.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles['retailer-link']}
                    >
                      <LinkIcon size={12} style={{ marginRight: '6px' }} />
                      <span className={styles['retailer-name']}>
                        {getSiteName(link.Url, link.RetailerName)}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <span className={styles['no-links']}>No purchase links available.</span>
              )}
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
                        {isMultiCount && metadata?.variations && metadata.variations.length > 0 && (
                          <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Choose Variation</label>
                            <select
                              value={selectedVariation}
                              onChange={(e) => setSelectedVariation(e.target.value)}
                              className={styles['variation-select']}
                            >
                              {metadata.variations.map((v: any, idx: number) => {
                                const claimed = item.Claims.filter(c => c.Selection === v.name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                                const remaining = Math.max(0, v.quantity - claimed);
                                return (
                                  <option key={idx} value={v.name} disabled={remaining <= 0}>
                                    {v.name} ({remaining} remaining)
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
                        <label className={styles['anon-label']}>
                          <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                          />
                          <span>Claim Anonymously</span>
                        </label>
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
