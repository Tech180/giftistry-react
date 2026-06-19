import React from 'react';
import { ExternalLink, Plus, Gift, CheckCircle, Star, Trash2, Link, Edit2, Pin, Check } from 'lucide-react';
import { Button, Card, Input } from 'shared/ui';
import { ItemCardTemplateProps } from '../../interfaces/item-card-template-props.interface';
import { getCategoryMeta } from './category-icons';
import styles from './item-card.module.css';

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
  isPinned,
  togglePin,
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
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
    <Card
      className={`${styles.itemCard} ${isFullyClaimed ? styles.claimedCard : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles.nonOwnerClaimed : ''} ${claimedByCurrentUser ? styles.userClaimedCard : ''} ${isTaggingModeActive ? styles.taggingModeCard : ''} ${isTaggedSelection ? styles.taggedCard : ''}`}
      padding="none"
      glass={true}
    >
      {/* Tagging Card Click Interceptor (covers card when in tagging mode) */}
      {isTaggingModeActive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelectTag?.();
          }}
          className={styles.taggingCardClickOverlay}
          aria-label="Toggle selection"
        />
      )}

      {/* Circle Tagging Select Section (before the star) */}
      {isTaggingModeActive && (
        <>
          <div className={styles.cardSelectSection}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectTag?.();
              }}
              className={`${styles.selectIndicatorCircle} ${isTaggedSelection ? styles.checked : ''}`}
              aria-label={isTaggedSelection ? "Deselect item" : "Select item"}
            >
              {isTaggedSelection && <Check size={12} strokeWidth={3.5} />}
            </button>
          </div>
          <div className={styles.cardDivider}></div>
        </>
      )}

      {/* Left Section - Favorite Star */}
      <>
        <div className={styles.cardLeftSection}>
          {isOwner ? (
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
          ) : (priorityLabel?.includes('★') || priorityLabel?.includes('Favorite')) ? (
            <div
              title="Favorited by Owner"
              style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
            </div>
          ) : (
            <div
              title="Not favorited"
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}
            >
              <Star size={20} fill="none" stroke="currentColor" />
            </div>
          )}

          {/* Pin Button for collaborators (underneath the star) */}
          {!isOwner && (
            <button
              onClick={togglePin}
              className={`${styles.pinBtnLeftSection} ${isPinned ? styles.pinBtnActive : ''}`}
              title={isPinned ? 'Unpin Item' : 'Pin Item'}
            >
              <Pin size={16} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
            </button>
          )}
        </div>
        <div className={styles.cardDivider}></div>
      </>

      {/* Main Content Area */}
      <div className={styles.cardMainContent}>
        <div className={styles.itemInfo}>
          <div className={styles.itemTitleRow}>
            <span className={styles.itemName}>{item.Name}</span>
            <div className={styles.itemTitleRight}>
              {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null && (
                <span className={styles.mainPriceTag}>${item.Links[0].ExtractedPrice}</span>
              )}
              {claimedByCurrentUser && (
                <span className={styles.myClaimBadge} title="You have claimed this item">
                  🎁 You claimed this!
                </span>
              )}
            </div>
          </div>
          {displayDescription && <p className={styles.itemDescription}>{displayDescription}</p>}
          
          <div className={styles.itemMeta}>
            {displayCategoryBadge && (
              <span className={styles.categoryBadge} title={`Category: ${categoryMeta.label}`}>
                <CategoryIcon size={12} style={{ marginRight: '4px' }} />
                {categoryMeta.label}
              </span>
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

          {item.IsHiddenIdea && !item.IsSuggestion && (
            <span className={styles.ideaBadge}>Collaborator Suggestion (Hidden from list owner)</span>
          )}
          {item.IsSuggestion && (
            <span className={styles.suggestionBadge}>
              🎁 Suggestion by {item.SuggestedByUsername || 'Collaborator'}
            </span>
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
                      {getSiteName(link.Url, link.RetailerName)}
                    </span>
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

        {/* Claim confirmation dropdown */}
        {showClaimForm && (
          <div className={styles.claimConfirmationDropdown}>
            <div className={styles.confirmPrompt}>Are you sure you want to claim this item?</div>
            <div className={styles.confirmActionsRow}>
              <div className={styles.confirmLeft}>
                <label className={styles.anonLabel}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <span>Anonymous</span>
                </label>
                {allowGroupFunds && totalExtractedPrice > 0 && (
                  <div className={styles.confirmFundWrapper}>
                    <label className={styles.fundLabel}>Amount:</label>
                    <input
                      type="number"
                      min="1"
                      max={totalExtractedPrice - totalClaimedAmount}
                      placeholder="Amt"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className={styles.fundInputSmall}
                    />
                  </div>
                )}
              </div>
              <div className={styles.confirmButtons}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleClaim()}
                  isLoading={claimLoading}
                >
                  Yes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClaimForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Actions Section */}
      <div className={styles.cardRightSection}>
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
            <div className={styles.claimStatusButtonBox}>
              {claimedByCurrentUser ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUnclaim}
                  isLoading={claimLoading}
                  className={styles.unclaimBtn}
                >
                  Unclaim
                </Button>
              ) : isFullyClaimed ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={true}
                  className={styles.claimedDisabledBtn}
                >
                  Claimed
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowClaimForm(true)}
                  className={styles.claimBtn}
                >
                  Claim
                </Button>
              )}
            </div>
          )}
        </div>

          {/* Claimed By Info at bottom */}
          {item.Claims.length > 0 && (!isOwner || isExpired) ? (
            <div className={styles.claimedByBox} title="Claim Details">
              <div className={styles.claimedByBoxLabel}>
                {allowGroupFunds ? 'Funded' : 'Claimed'}
              </div>
              <div className={styles.claimedByBoxSub}>by</div>
              <div className={styles.claimedByBoxName}>
                {item.Claims.map((c) => c.ClaimedByName || 'Anonymous').join(', ')}
              </div>
            </div>
          ) : (
            <div style={{ height: '20px' }}></div>
          )}
        </div>
      </Card>
  );
};
