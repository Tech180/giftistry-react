import React from 'react';
import { Star, Link as LinkIcon, Edit2, Trash2, Tag } from 'lucide-react';
import { Button, Card } from 'shared/ui';
import { ItemShowcaseTemplateProps } from '../../interfaces/item-showcase-template-props.interface';
import styles from './item-showcase.module.css';

const getSiteName = (url: string, retailerName?: string | null) => {
  if (retailerName) return retailerName;
  try {
    const hostname = new URL(url).hostname;
    const domain = hostname.replace(/^www\./, '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (_) {
    return 'View Store';
  }
};

export const ItemShowcaseTemplate: React.FC<ItemShowcaseTemplateProps> = ({
  item,
  priorityLabel,
  isOwner,
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
}) => {
  return (
    <Card className={styles.showcaseCard} padding="none" glass={true}>
      <div className={styles.showcaseHeader}>
        <div className={styles.showcaseTitleArea}>
          <div className={styles.showcaseMetaLine}>
            <span className={styles.showcaseCategory}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {item.Category || 'General'}
            </span>
          </div>
          <h3 className={styles.showcaseTitle}>{item.Name}</h3>
        </div>
        <div className={styles.showcaseHeaderActions}>
          {localIsFavorite && (
            <span className={styles.detailStarIcon} title="Favorite Item">
              <Star size={18} fill="currentColor" />
            </span>
          )}
          <button onClick={onClose} className={styles.closeBtn} title="Close Preview">
            &times;
          </button>
        </div>
      </div>

      <div className={styles.showcaseBody}>
        <div className={styles.showcaseGrid}>
          {/* Left Column: Info & Description */}
          <div className={styles.infoCol}>
            {displayDescription ? (
              <div className={styles.descriptionBox}>
                <h4 className={styles.sectionTitle}>Description</h4>
                <p className={styles.descriptionText}>{displayDescription}</p>
              </div>
            ) : (
              <div className={styles.descriptionBoxEmpty}>
                <p>No description provided for this item.</p>
              </div>
            )}

            {/* Custom metadata fields */}
            {metadata && (metadata.shirtSize || metadata.pantsSize || metadata.shoesSize || metadata.socksSize || metadata.color) ? (
              <div className={styles.metaSection}>
                <h4 className={styles.sectionTitle}>Details / Sizing</h4>
                <div className={styles.metaBadges}>
                  {metadata.shirtSize && <span className={styles.metaBadge}>👕 Shirt: {metadata.shirtSize}</span>}
                  {metadata.pantsSize && <span className={styles.metaBadge}>👖 Pants: {metadata.pantsSize}</span>}
                  {metadata.shoesSize && <span className={styles.metaBadge}>👟 Shoes: {metadata.shoesSize}</span>}
                  {metadata.socksSize && <span className={styles.metaBadge}>🧦 Socks: {metadata.socksSize}</span>}
                  {metadata.color && <span className={styles.metaBadge}>🎨 Color: {metadata.color}</span>}
                </div>
              </div>
            ) : null}

            {metadata?.custom?.map((f: any, idx: number) => (
              <div key={idx} className={styles.descriptionBox}>
                <h4 className={styles.sectionTitle}>{f.name}</h4>
                <p className={styles.descriptionText}>{f.value}</p>
              </div>
            ))}

            {/* Variations progress */}
            {isMultiCount && metadata?.variations && metadata.variations.length > 0 && (
              <div className={styles.variationsSection}>
                <h4 className={styles.sectionTitle}>Variations Progress</h4>
                <div className={styles.variationsProgressList}>
                  {metadata.variations.map((v: any, idx: number) => {
                    const claimed = item.Claims.filter(c => c.Selection === v.name).reduce((sum: number, c: any) => sum + (c.Quantity || 1), 0);
                    const percent = Math.min(100, Math.round((claimed / v.quantity) * 100));
                    return (
                      <div key={idx} className={styles.variationProgressCard}>
                        <div className={styles.variationProgressHeader}>
                          <span className={styles.variationName}>{v.name}</span>
                          <span className={styles.variationQty}>{claimed} / {v.quantity} Claimed</span>
                        </div>
                        <div className={styles.progressBarBgMini}>
                          <div className={styles.progressBarFillMini} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Links, and Funding */}
          <div className={styles.actionCol}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>Best Price</span>
              <span className={styles.priceValue}>
                {totalExtractedPrice > 0 ? `$${totalExtractedPrice}` : '—'}
              </span>
            </div>

            {/* Progress Bar for Group Funding / Multi-Count Items */}
            {isMultiCount ? (
              <div className={styles.fundingSection}>
                <div className={styles.fundingHeader}>
                  <span>Quantities Claimed</span>
                  <span>{progressPercent}% ({totalClaimedQty} / {desiredQtyVal})</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              allowGroupFunds && totalExtractedPrice > 0 && (
                <div className={styles.fundingSection}>
                  <div className={styles.fundingHeader}>
                    <span>Group Funding Progress</span>
                    <span>{progressPercent}% (${totalClaimedAmount} / ${totalExtractedPrice})</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )
            )}

            {/* Purchase Links */}
            <div className={styles.linksSection}>
              <h4 className={styles.sectionTitle}>Purchase Links</h4>
              {item.Links.length > 0 ? (
                <div className={styles.linksList}>
                  {item.Links.map((link) => (
                    <a
                      key={link.Id}
                      href={link.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.retailerLink}
                    >
                      <LinkIcon size={12} style={{ marginRight: '6px' }} />
                      <span className={styles.retailerName}>
                        {getSiteName(link.Url, link.RetailerName)}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <span className={styles.noLinks}>No purchase links available.</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionsArea}>
              {!isOwner ? (
                claimedByCurrentUser ? (
                  <Button
                    variant="secondary"
                    className={styles.claimButton}
                    onClick={handleUnclaim}
                    isLoading={claimLoading}
                  >
                    Unclaim Item
                  </Button>
                ) : isFullyClaimed ? (
                  <Button
                    variant="secondary"
                    className={styles.claimButton}
                    disabled={true}
                  >
                    Already Claimed
                  </Button>
                ) : (
                  <div className={styles.claimWidget}>
                    {showClaimForm ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleClaim();
                        }}
                        className={styles.claimForm}
                      >
                        {isMultiCount && metadata?.variations && metadata.variations.length > 0 && (
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Choose Variation</label>
                            <select
                              value={selectedVariation}
                              onChange={(e) => setSelectedVariation(e.target.value)}
                              className={styles.variationSelect}
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
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Quantity to Claim</label>
                            <input
                              type="number"
                              min="1"
                              value={claimQty}
                              onChange={(e) => setClaimQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              style={{ width: '80px' }}
                              className={styles.qtyInput}
                              required
                            />
                          </div>
                        )}

                        {!isMultiCount && allowGroupFunds && (
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Amount to Contribute</label>
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
                        <label className={styles.anonLabel}>
                          <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                          />
                          <span>Claim Anonymously</span>
                        </label>
                        <div className={styles.formActions}>
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
                        className={styles.claimButton}
                        onClick={() => setShowClaimForm(true)}
                      >
                        Claim Item
                      </Button>
                    )}
                  </div>
                )
              ) : (
                <div className={styles.ownerActions}>
                  <Button variant="secondary" className={styles.ownerBtn} onClick={onEdit}>
                    <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                  </Button>
                  {showDeleteConfirm ? (
                    <div className={styles.deleteConfirmWidget}>
                      <span className={styles.confirmPrompt}>Delete?</span>
                      <div className={styles.confirmButtons}>
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
                      className={`${styles.ownerBtn} ${styles.deleteBtn}`}
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
        <div className={styles.modalOverlay}>
          <Card className={styles.dependencyModal} glass={true}>
            <h3 className={styles.modalTitle}>🔗 Connected Gift Items</h3>
            <p className={styles.modalText}>
              This gift is linked to other items in the wishlist. Would you like to claim them all at once?
            </p>
            <div className={styles.linkedItemsPreviewList}>
              {wishlistItems
                .filter((wi: any) => (metadata?.linkedItemIds || []).includes(wi.Id))
                .map((wi: any) => {
                  return (
                    <div key={wi.Id} className={styles.linkedItemPreviewRow}>
                      <span className={wi.Name}>{wi.Name}</span>
                      <span className={wi.IsClaimed ? styles.linkedItemStatusClaimed : styles.linkedItemStatusAvailable}>
                        {wi.IsClaimed ? 'Already Claimed' : 'Available'}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className={styles.modalActions}>
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
