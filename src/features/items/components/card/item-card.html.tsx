import React from 'react';
import { ExternalLink, Plus, Gift, CheckCircle, Star, Trash2, Link, Edit2 } from 'lucide-react';
import { Button, Card, Input } from 'shared/ui';
import { ItemCardTemplateProps } from '../../interfaces/item-card-template-props.interface';
import { getCategoryMeta } from './category-icons';
import styles from './item-card.module.css';

export const ItemCardTemplate: React.FC<ItemCardTemplateProps> = ({
  item,
  isOwner,
  isExpired,
  canCollaborate,
  allowGroupFunds,
  isFullyClaimed,
  totalExtractedPrice,
  totalClaimedAmount,
  priorityLabel,
  urlInput,
  setUrlInput,
  showAddLink,
  setShowAddLink,
  linkLoading,
  handleAddLink,
  showClaimForm,
  setShowClaimForm,
  claimAmount,
  setClaimAmount,
  claimedByName,
  setClaimedByName,
  claimLoading,
  handleClaim,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteLoading,
  handleDelete,
  isFavorite,
  toggleFavorite,
  onEdit,
}) => {
  // Parse JSON description if applicable
  let displayDescription: string | null = null;
  let metadata: any = null;
  if (item.Description) {
    try {
      if (item.Description.startsWith('{') && item.Description.endsWith('}')) {
        const parsed = JSON.parse(item.Description);
        if (parsed && typeof parsed === 'object') {
          displayDescription = parsed.text || null;
          metadata = parsed;
        }
      }
    } catch (_) {}
    
    if (displayDescription === null) {
      displayDescription = item.Description;
    }
  }

  const categoryMeta = getCategoryMeta(item.Category);
  const CategoryIcon = categoryMeta.icon;
  const displayCategoryBadge = item.Category && item.Category !== 'uncategorized';

  return (
    <Card className={`${styles.itemCard} ${isFullyClaimed ? styles.claimedCard : ''}`} padding="none" glass={true}>
      {/* Left Section - Favorite Star */}
      <div className={styles.cardLeftSection}>
        <button
          onClick={toggleFavorite}
          className={`${styles.cardActionBtn} ${styles.starBtn} ${isFavorite ? styles.active : ''}`}
          title="Toggle favorite"
        >
          <Star
            size={20}
            fill={isFavorite ? '#f59e0b' : 'none'}
            stroke={isFavorite ? '#f59e0b' : 'currentColor'}
          />
        </button>
      </div>

      {/* Vertical Divider */}
      <div className={styles.cardDivider}></div>

      {/* Main Content Area */}
      <div className={styles.cardMainContent}>
        <div className={styles.itemInfo}>
          <div className={styles.itemTitleRow}>
            <span className={styles.itemName}>{item.Name}</span>
          </div>
          {displayDescription && <p className={styles.itemDescription}>{displayDescription}</p>}
          
          <div className={styles.itemMeta}>
            {displayCategoryBadge && (
              <span className={styles.categoryBadge} title={`Category: ${categoryMeta.label}`}>
                <CategoryIcon size={12} style={{ marginRight: '4px' }} />
                {categoryMeta.label}
              </span>
            )}
            {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null && (
              <span className={styles.priceTag}>${item.Links[0].ExtractedPrice}</span>
            )}
          </div>

          {metadata && (
            <div className={styles.metadataGrid}>
              {metadata.pantsSize && (
                <span className={styles.metadataBadge} title="Pants Size">
                  👖 Pants: {metadata.pantsSize}
                </span>
              )}
              {metadata.shirtSize && (
                <span className={styles.metadataBadge} title="Shirt Size">
                  👕 Shirt: {metadata.shirtSize}
                </span>
              )}
              {metadata.shoesSize && (
                <span className={styles.metadataBadge} title="Shoes Size">
                  👟 Shoes: {metadata.shoesSize}
                </span>
              )}
              {metadata.socksSize && (
                <span className={styles.metadataBadge} title="Socks Size">
                  🧦 Socks: {metadata.socksSize}
                </span>
              )}
              {metadata.color && (
                <span className={styles.metadataBadge} title="Color">
                  🎨 Color: {metadata.color}
                </span>
              )}
              {metadata.custom?.map((f: any, idx: number) => (
                <span key={idx} className={styles.metadataBadge} title={f.name}>
                  📌 {f.name}: {f.value}
                </span>
              ))}
            </div>
          )}

          {item.IsHiddenIdea && (
            <span className={styles.ideaBadge}>Collaborator Suggestion (Hidden from list owner)</span>
          )}
        </div>

        {/* Retail links list */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h5>Purchasing Links</h5>
            {!isOwner && canCollaborate && (
              <button
                onClick={() => setShowAddLink(!showAddLink)}
                className={styles.addLinkToggle}
              >
                <Plus size={14} /> Add Link
              </button>
            )}
          </div>

          {showAddLink && (
            <form onSubmit={handleAddLink} className={styles.linkForm}>
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
                className={styles.linkInput}
              />
              <Button type="submit" variant="secondary" size="sm" isLoading={linkLoading}>
                Add
              </Button>
            </form>
          )}

          {item.Links.length > 0 ? (
            <ul className={styles.linksList}>
              {item.Links.map((link) => (
                <li key={link.Id} className={styles.linkItem}>
                  <a
                    href={link.Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.retailerLink}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <Link size={12} style={{ marginRight: '4px' }} />
                    <span>
                      {link.RetailerName || 'View Store'} 
                      {link.ExtractedPrice !== null && ` - $${link.ExtractedPrice}`}
                    </span>
                    <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.7 }} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>No links added yet.</p>
          )}
        </div>

        {/* Group funding progress */}
        {allowGroupFunds && totalExtractedPrice > 0 && (
          <div className={styles.section}>
            <div className={styles.fundingHeader}>
              <span>Group Funding Progress</span>
              <span>
                ${totalClaimedAmount.toFixed(2)} / ${totalExtractedPrice.toFixed(2)}
              </span>
            </div>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Claims list & actions */}
        {!isOwner && (
          <div className={styles.section}>
            <h5>Claims</h5>
            <>
              {item.Claims.length > 0 ? (
                <ul className={styles.claimsList}>
                  {item.Claims.map((claim) => (
                    <li key={claim.Id} className={styles.claimItem}>
                      <Gift size={12} />
                      <span>
                        Claimed by <strong>{claim.ClaimedByName || 'Anonymous'}</strong>
                        {allowGroupFunds && claim.Amount !== null && ` ($${claim.Amount})`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyText}>No one has claimed this item yet.</p>
              )}

              {!isFullyClaimed && (
                <div className={styles.claimActionBox}>
                  {!showClaimForm ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowClaimForm(true)}
                    >
                      Claim Item
                    </Button>
                  ) : (
                    <form onSubmit={handleClaim} className={styles.claimForm}>
                      <div className={styles.claimInputs}>
                        <Input
                          label="Your Name (Optional)"
                          placeholder="Anonymous"
                          value={claimedByName}
                          onChange={(e) => setClaimedByName(e.target.value)}
                        />
                        {allowGroupFunds && totalExtractedPrice > 0 && (
                          <Input
                            label="Amount to Fund"
                            type="number"
                            min="1"
                            max={totalExtractedPrice - totalClaimedAmount}
                            placeholder="Amount"
                            value={claimAmount}
                            onChange={(e) => setClaimAmount(e.target.value)}
                          />
                        )}
                      </div>
                      <div className={styles.claimActions}>
                        <Button type="submit" variant="primary" size="sm" isLoading={claimLoading}>
                          Confirm Claim
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowClaimForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          </div>
        )}
      </div>

      {/* Right Actions Section */}
      <div className={styles.cardRightSection}>
        {/* Status badge at top */}
        <div className={styles.badgeSection}>
          {isFullyClaimed ? (
            <span className={`${styles.claimBadge} ${styles.claimed}`}>
              <CheckCircle size={12} /> Claimed
            </span>
          ) : item.IsClaimed && isOwner && !isExpired ? (
            <span className={`${styles.claimBadge} ${styles.mystery}`}>
              <Gift size={12} /> Claimed (Surprise)
            </span>
          ) : (
            <span className={`${styles.claimBadge} ${styles.unclaimed}`}>
              Unclaimed
            </span>
          )}
        </div>

        {/* Center Actions Section */}
        <div className={styles.centerActions}>
          {isOwner ? (
            <div className={styles.ownerActions}>
              {!showDeleteConfirm && (
                <button
                  onClick={onEdit}
                  className={styles.editBtn}
                  title="Edit Item"
                >
                  <Edit2 size={16} />
                </button>
              )}
              {showDeleteConfirm ? (
                <div className={styles.deleteConfirmBox}>
                  <span className={styles.deleteConfirmText}>Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className={styles.deleteConfirmBtn}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className={styles.deleteCancelBtn}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteLoading}
                  className={styles.deleteBtn}
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ) : (
            <>
              {item.Links.length > 0 && (
                <a
                  href={item.Links[0].Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitStoreBtn}
                >
                  <ExternalLink size={14} style={{ marginRight: '4px' }} />
                  Visit store
                </a>
              )}
            </>
          )}
        </div>

        {/* Spacing element at bottom */}
        <div style={{ height: '20px' }}></div>
      </div>
    </Card>
  );
};
