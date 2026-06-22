import React from 'react';
import { Plus, Star, Trash2, Link, Edit2, Pin, Check } from 'lucide-react';
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
  viewMode = 'full',
  isSelected,
  onSelect,
  isExpanded = false,
  setIsExpanded,
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
    } catch (_) { }

    if (displayDescription === null) {
      displayDescription = item.Description;
    }
  }

  const categoryMeta = getCategoryMeta(item.Category);
  const CategoryIcon = categoryMeta.icon;
  const displayCategoryBadge = item.Category && item.Category !== 'uncategorized';

  if (viewMode === 'compact') {
    return (
      <Card
        className={`${styles.itemCard} ${styles.compactCard} ${isExpanded ? styles.expandedCard : ''} ${isFullyClaimed ? styles.claimedCard : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles.nonOwnerClaimed : ''} ${claimedByCurrentUser ? styles.userClaimedCard : ''} ${isTaggingModeActive ? styles.taggingModeCard : ''} ${isTaggedSelection ? styles.taggedCard : ''}`}
        padding="none"
        glass={true}
      >
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

        <div
          className={styles.compactRow}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('a') || target.closest('input')) {
              return;
            }
            setIsExpanded?.(!isExpanded);
          }}
          style={{ cursor: 'pointer' }}
        >
          {/* Tag Select indicator */}
          {isTaggingModeActive && (
            <div className={styles.compactSelectSection}>
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
          )}

          {/* Star Favorite */}
          <div className={styles.compactStarSection}>
            {isOwner ? (
              <button
                onClick={toggleFavorite}
                className={`${styles.compactStarBtn} ${isFavorite ? styles.active : ''}`}
                title="Toggle favorite"
              >
                <Star
                  size={16}
                  fill={isFavorite ? '#f59e0b' : 'none'}
                  stroke={isFavorite ? '#f59e0b' : 'currentColor'}
                />
              </button>
            ) : isFavorite ? (
              <div title="Favorited by Owner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
              </div>
            ) : (
              <Star size={16} fill="none" stroke="currentColor" style={{ opacity: 0.3 }} />
            )}
          </div>

          {/* Item details */}
          <div className={styles.compactInfoSection}>
            <span className={styles.compactItemName} title={item.Name}>{item.Name}</span>
            {displayCategoryBadge && (
              <span
                className={styles.compactCategoryBadge}
                title={`Category: ${categoryMeta.label}`}
                style={{
                  backgroundColor: `${categoryMeta.color}15`,
                  borderColor: `${categoryMeta.color}30`,
                  color: categoryMeta.color
                }}
              >
                <CategoryIcon size={10} />
              </span>
            )}

            {/* Show tiny sizing details directly if present */}
            {metadata && (
              <div className={styles.compactMetaRow}>
                {metadata.pantsSize && <span>Pants: {metadata.pantsSize}</span>}
                {metadata.shirtSize && <span>Shirt: {metadata.shirtSize}</span>}
                {metadata.shoesSize && <span>Shoes: {metadata.shoesSize}</span>}
                {metadata.socksSize && <span>Socks: {metadata.socksSize}</span>}
                {metadata.color && <span>Color: {metadata.color}</span>}
              </div>
            )}
          </div>

          {/* Links / Store indicator */}
          <div className={styles.compactLinksSection}>
            {item.Links.length > 0 ? (
              <a
                href={item.Links[0].Url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.compactStoreLink}
                title={`Visit ${getSiteName(item.Links[0].Url, item.Links[0].RetailerName)}`}
              >
                <Link size={12} style={{ marginRight: '4px' }} />
                <span>{getSiteName(item.Links[0].Url, item.Links[0].RetailerName)}</span>
              </a>
            ) : (
              <span className={styles.compactNoLinks}>No link</span>
            )}
          </div>

          {/* Price */}
          <div className={styles.compactPriceSection}>
            {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null ? (
              <span className={styles.compactPriceTag}>${item.Links[0].ExtractedPrice}</span>
            ) : (
              <span className={styles.compactNoPrice}>—</span>
            )}
          </div>

          {/* Claim Action */}
          <div className={styles.compactClaimSection}>
            {!isOwner && (
              claimedByCurrentUser ? (
                <button
                  onClick={handleUnclaim}
                  disabled={claimLoading}
                  className={`${styles.compactActionBtn} ${styles.compactUnclaimBtn}`}
                >
                  Unclaim
                </button>
              ) : isFullyClaimed ? (
                <span className={styles.compactClaimedStatus}>Claimed</span>
              ) : (
                <button
                  onClick={() => setShowClaimForm(true)}
                  className={`${styles.compactActionBtn} ${styles.compactClaimBtn}`}
                >
                  Claim
                </button>
              )
            )}

            {isOwner && (
              <div className={styles.compactOwnerActions}>
                <button onClick={onEdit} className={styles.compactIconBtn} title="Edit Item">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className={styles.compactIconBtn} title="Delete Item">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {showClaimForm && (
          <div className={styles.compactConfirmExtension}>
            <div className={styles.confirmPromptColumn}>
              <span className={styles.confirmPrompt}>Claim this item?</span>
              <label className={styles.anonLabel}>
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                <span>Anonymously</span>
              </label>
            </div>
            <div className={styles.confirmButtons}>
              <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>Yes</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className={styles.compactConfirmExtension}>
            <span className={styles.confirmPrompt}>Delete this item?</span>
            <div className={styles.confirmButtons}>
              <Button variant="primary" size="sm" onClick={handleDelete} isLoading={deleteLoading}>Yes</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>No</Button>
            </div>
          </div>
        )}

        {/* Accordion Expanded Details */}
        {isExpanded && (
          <div className={styles.expandedSection}>
            <div className={styles.expandedContent}>
              {displayDescription && (
                <div className={styles.expandedDetailRow}>
                  <span className={styles.expandedDetailLabel}>Description:</span>
                  <p className={styles.expandedDescriptionText}>{displayDescription}</p>
                </div>
              )}

              {metadata && (metadata.pantsSize || metadata.shirtSize || metadata.shoesSize || metadata.socksSize || metadata.color) && (
                <div className={styles.expandedDetailRow}>
                  <span className={styles.expandedDetailLabel}>Sizing & Details:</span>
                  <div className={styles.expandedMetaBadges}>
                    {metadata.pantsSize && <span className={styles.expandedMetaBadge}>👖 Pants: {metadata.pantsSize}</span>}
                    {metadata.shirtSize && <span className={styles.expandedMetaBadge}>👕 Shirt: {metadata.shirtSize}</span>}
                    {metadata.shoesSize && <span className={styles.expandedMetaBadge}>👟 Shoes: {metadata.shoesSize}</span>}
                    {metadata.socksSize && <span className={styles.expandedMetaBadge}>🧦 Socks: {metadata.socksSize}</span>}
                    {metadata.color && <span className={styles.expandedMetaBadge}>🎨 Color: {metadata.color}</span>}
                  </div>
                </div>
              )}

              {metadata?.custom?.map((f: any, idx: number) => (
                <div key={idx} className={styles.expandedDetailRow}>
                  <span className={styles.expandedDetailLabel}>{f.name}:</span>
                  <div className={styles.expandedDetailValue}>{f.value}</div>
                </div>
              ))}

              {/* Group Funding Progress */}
              {allowGroupFunds && totalExtractedPrice > 0 && (
                <div className={styles.expandedDetailRow}>
                  <span className={styles.expandedDetailLabel}>Funding Progress:</span>
                  <div className={styles.expandedFundingWrapper}>
                    <div className={styles.expandedFundingHeader}>
                      <span>${totalClaimedAmount.toFixed(2)} funded of ${totalExtractedPrice.toFixed(2)}</span>
                      <span>{Math.min(100, Math.round((totalClaimedAmount / totalExtractedPrice) * 100))}%</span>
                    </div>
                    <div className={styles.expandedProgressBarBg}>
                      <div
                        className={styles.expandedProgressBarFill}
                        style={{ width: `${Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className={styles.expandedDetailRow}>
                <span className={styles.expandedDetailLabel}>Links:</span>
                {item.Links.length > 0 ? (
                  <div className={styles.expandedLinksContainer}>
                    {item.Links.map((link) => (
                      <a
                        key={link.Id}
                        href={link.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.expandedStoreLink}
                      >
                        <Link size={12} style={{ marginRight: '4px' }} />
                        {getSiteName(link.Url, link.RetailerName)}
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className={styles.expandedNoLinks}>No links added yet.</span>
                )}
              </div>
            </div>
          </div>
        )}


      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <Card
        className={`${styles.itemCard} ${styles.gridCard} ${isSelected ? styles.selectedGridCard : ''} ${isFullyClaimed ? styles.claimedCard : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles.nonOwnerClaimed : ''} ${claimedByCurrentUser ? styles.userClaimedCard : ''} ${isTaggingModeActive ? styles.taggingModeCard : ''} ${isTaggedSelection ? styles.taggedCard : ''}`}
        padding="none"
        glass={true}
        onClick={onSelect}
        style={{ cursor: 'pointer' }}
      >
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

        {/* Pin button at top-left corner */}
        {!isOwner && (
          <button
            onClick={togglePin}
            className={`${styles.gridPinBtnAbsolute} ${isPinned ? styles.pinBtnActive : ''}`}
            title={isPinned ? 'Unpin Item' : 'Pin Item'}
          >
            <Pin size={10} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
          </button>
        )}

        {/* Top bar with category and favorite indicator */}
        <div className={styles.gridTopBar}>
          <div className={styles.gridCategoryContainer}>
            {displayCategoryBadge && (
              <span
                className={styles.gridCategoryBadge}
                title={`Category: ${categoryMeta.label}`}
                style={{
                  backgroundColor: `${categoryMeta.color}15`,
                  borderColor: `${categoryMeta.color}30`,
                  color: categoryMeta.color
                }}
              >
                <CategoryIcon size={10} />
              </span>
            )}
          </div>

          <div className={styles.gridActionsContainer}>
            {isOwner ? (
              <button
                type="button"
                onClick={toggleFavorite}
                className={`${styles.gridStarBtn} ${isFavorite ? styles.active : ''}`}
                title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
                style={{ zIndex: 50 }}
              >
                <Star
                  size={10}
                  fill={isFavorite ? '#f59e0b' : 'none'}
                  stroke={isFavorite ? '#f59e0b' : 'currentColor'}
                />
              </button>
            ) : isFavorite ? (
              <div title="Favorited by Owner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.gridContent}>
          <h4 className={styles.gridItemName} title={item.Name}>{item.Name}</h4>

          {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null ? (
            <div className={styles.gridPriceTag}>${item.Links[0].ExtractedPrice}</div>
          ) : (
            <div className={styles.gridNoPrice}>—</div>
          )}
        </div>

        {/* Claim button at bottom center */}
        {!isOwner && (
          <div className={styles.gridClaimContainerAbsolute}>
            {claimedByCurrentUser ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnclaim();
                }}
                disabled={claimLoading}
                className={`${styles.gridMiniClaimBtn} ${styles.gridMiniClaimed}`}
              >
                Unclaim
              </button>
            ) : isFullyClaimed ? (
              <span className={`${styles.gridMiniClaimBtn} ${styles.gridMiniClaimedDisabled}`}>
                Claimed
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClaimForm(true);
                }}
                className={styles.gridMiniClaimBtn}
              >
                Claim
              </button>
            )}
          </div>
        )}

        {/* Mini claim confirmation overlay */}
        {showClaimForm && (
          <div className={styles.gridMiniOverlay} onClick={(e) => e.stopPropagation()}>
            <div className={styles.gridMiniOverlayPrompt}>Claim?</div>
            <div className={styles.gridMiniOverlayActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaim();
                }}
                disabled={claimLoading}
                className={styles.gridMiniConfirmBtn}
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClaimForm(false);
                }}
                className={styles.gridMiniCancelBtn}
              >
                No
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  }

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
          ) : isFavorite ? (
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
                  {f.name}: {f.value}
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
            <h5>Links</h5>
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

        {item.Claims.length > 0 && (!isOwner || isExpired) && (
          <div className={styles.claimedByBox} title="Claim Details">
            <div className={styles.claimedByBoxLabel}>
              {allowGroupFunds ? 'Funded' : 'Claimed'}
            </div>
            <div className={styles.claimedByBoxSub}>by</div>
            <div className={styles.claimedByBoxName}>
              {item.Claims.map((c) => c.ClaimedByName || 'Anonymous').join(', ')}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
