import React from 'react';
import { Plus, Star, Trash2, Link, Edit2, Pin, Check } from 'lucide-react';
import { Button, Card, Input, EnterPanel } from 'shared/ui';
import { ItemCardTemplateProps } from '../../interfaces/item-card-template-props.interface';
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
  displayDescription,
  metadata,
  CategoryIcon,
  displayCategoryBadge,
  categoryLabel,
  getSiteName,
}) => {
  if (viewMode === 'compact') {
    return (
      <Card
        className={`${styles['item-card']} ${styles['compact-card']} ${isExpanded ? styles['expanded-card'] : ''} ${isFullyClaimed ? styles['claimed-card'] : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles['non-owner-claimed'] : ''} ${claimedByCurrentUser ? styles['user-claimed-card'] : ''} ${isTaggingModeActive ? styles['tagging-mode-card'] : ''} ${isTaggedSelection ? styles['tagged-card'] : ''}`}
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
            className={styles['tagging-card-click-overlay']}
            aria-label="Toggle selection"
          />
        )}

        <div
          className={styles['compact-row']}
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
            <div className={styles['compact-select-section']}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectTag?.();
                }}
                className={`${styles['select-indicator-circle']} ${isTaggedSelection ? styles.checked : ''}`}
                aria-label={isTaggedSelection ? "Deselect item" : "Select item"}
              >
                {isTaggedSelection && <Check size={12} strokeWidth={3.5} />}
              </button>
            </div>
          )}

          {/* Star Favorite */}
          <div className={styles['compact-star-section']}>
            {isOwner ? (
              <button
                onClick={toggleFavorite}
                className={`${styles['compact-star-btn']} ${isFavorite ? styles.active : ''}`}
                title="Toggle favorite"
              >
                <Star
                  size={16}
                  fill={isFavorite ? 'var(--warning)' : 'none'}
                  stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                />
              </button>
            ) : isFavorite ? (
              <div title="Favorited by Owner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={16} fill="var(--warning)" stroke="var(--warning)" />
              </div>
            ) : (
              <Star size={16} fill="none" stroke="currentColor" style={{ opacity: 0.3 }} />
            )}
          </div>

          {/* Item details */}
          <div className={styles['compact-info-section']}>
            <span className={styles['compact-item-name']} title={item.Name}>{item.Name}</span>
            {displayCategoryBadge && (
              <span className={styles['compact-category-badge']} title={`Category: ${categoryLabel}`}>
                <CategoryIcon size={10} style={{ marginRight: '2px' }} />
                {categoryLabel}
              </span>
            )}

            {/* Show tiny sizing details directly if present */}
            {metadata && (
              <div className={styles['compact-meta-row']}>
                {metadata.pantsSize && <span>Pants: {metadata.pantsSize}</span>}
                {metadata.shirtSize && <span>Shirt: {metadata.shirtSize}</span>}
                {metadata.shoesSize && <span>Shoes: {metadata.shoesSize}</span>}
                {metadata.socksSize && <span>Socks: {metadata.socksSize}</span>}
                {metadata.color && <span>Color: {metadata.color}</span>}
              </div>
            )}
          </div>

          {/* Links / Store indicator */}
          <div className={styles['compact-links-section']}>
            {item.Links.length > 0 ? (
              <a
                href={item.Links[0].Url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['compact-store-link']}
                title={`Visit ${getSiteName(item.Links[0].Url, item.Links[0].RetailerName)}`}
              >
                <Link size={12} style={{ marginRight: '4px' }} />
                <span>{getSiteName(item.Links[0].Url, item.Links[0].RetailerName)}</span>
              </a>
            ) : (
              <span className={styles['compact-no-links']}>No link</span>
            )}
          </div>

          {/* Price */}
          <div className={styles['compact-price-section']}>
            {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null ? (
              <span className={styles['compact-price-tag']}>${item.Links[0].ExtractedPrice}</span>
            ) : (
              <span className={styles['compact-no-price']}>—</span>
            )}
          </div>

          {/* Claim Action */}
          <div className={styles['compact-claim-section']}>
            {!isOwner && (
              claimedByCurrentUser ? (
                <button
                  onClick={handleUnclaim}
                  disabled={claimLoading}
                  className={`${styles['compact-action-btn']} ${styles['compact-unclaim-btn']}`}
                >
                  Unclaim
                </button>
              ) : isFullyClaimed ? (
                <span className={styles['compact-claimed-status']}>Claimed</span>
              ) : (
                <button
                  onClick={() => setShowClaimForm(true)}
                  className={`${styles['compact-action-btn']} ${styles['compact-claim-btn']}`}
                >
                  Claim
                </button>
              )
            )}

            {canCollaborate && (
              <div className={styles['compact-owner-actions']}>
                <button onClick={onEdit} className={styles['compact-icon-btn']} title="Edit Item">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className={styles['compact-icon-btn']} title="Delete Item">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {showClaimForm && (
          <EnterPanel animation="dropdown" className={styles['compact-confirm-extension']}>
            <div className={styles['confirm-prompt-column']}>
              <span className={styles['confirm-prompt']}>Claim this item?</span>
              <label className={styles['anon-label']}>
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                <span>Anonymously</span>
              </label>
            </div>
            <div className={styles['confirm-buttons']}>
              <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>Yes</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>Cancel</Button>
            </div>
          </EnterPanel>
        )}

        {showDeleteConfirm && (
          <EnterPanel animation="dropdown" className={styles['compact-confirm-extension']}>
            <span className={styles['confirm-prompt']}>Delete this item?</span>
            <div className={styles['confirm-buttons']}>
              <Button variant="primary" size="sm" onClick={handleDelete} isLoading={deleteLoading}>Yes</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>No</Button>
            </div>
          </EnterPanel>
        )}

        {/* Accordion Expanded Details */}
        {isExpanded && (
          <EnterPanel animation="accordion" className={styles['expanded-section']}>
            <div className={styles['expanded-content']}>
              {displayDescription && (
                <div className={styles['expanded-detail-row']}>
                  <span className={styles['expanded-detail-label']}>Description:</span>
                  <p className={styles['expanded-description-text']}>{displayDescription}</p>
                </div>
              )}

              {metadata && (metadata.pantsSize || metadata.shirtSize || metadata.shoesSize || metadata.socksSize || metadata.color) && (
                <div className={styles['expanded-detail-row']}>
                  <span className={styles['expanded-detail-label']}>Sizing & Details:</span>
                  <div className={styles['expanded-meta-badges']}>
                    {metadata.pantsSize && <span className={styles['expanded-meta-badge']}>👖 Pants: {metadata.pantsSize}</span>}
                    {metadata.shirtSize && <span className={styles['expanded-meta-badge']}>👕 Shirt: {metadata.shirtSize}</span>}
                    {metadata.shoesSize && <span className={styles['expanded-meta-badge']}>👟 Shoes: {metadata.shoesSize}</span>}
                    {metadata.socksSize && <span className={styles['expanded-meta-badge']}>🧦 Socks: {metadata.socksSize}</span>}
                    {metadata.color && <span className={styles['expanded-meta-badge']}>🎨 Color: {metadata.color}</span>}
                  </div>
                </div>
              )}

              {metadata?.custom?.map((f: any, idx: number) => (
                <div key={idx} className={styles['expanded-detail-row']}>
                  <span className={styles['expanded-detail-label']}>{f.name}:</span>
                  <div className={styles['expanded-detail-value']}>{f.value}</div>
                </div>
              ))}

              {/* Group Funding Progress */}
              {allowGroupFunds && totalExtractedPrice > 0 && (
                <div className={styles['expanded-detail-row']}>
                  <span className={styles['expanded-detail-label']}>Funding Progress:</span>
                  <div className={styles['expanded-funding-wrapper']}>
                    <div className={styles['expanded-funding-header']}>
                      <span>${totalClaimedAmount.toFixed(2)} funded of ${totalExtractedPrice.toFixed(2)}</span>
                      <span>{Math.min(100, Math.round((totalClaimedAmount / totalExtractedPrice) * 100))}%</span>
                    </div>
                    <div className={styles['expanded-progress-bar-bg']}>
                      <div
                        className={styles['expanded-progress-bar-fill']}
                        style={{ width: `${Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className={styles['expanded-detail-row']}>
                <span className={styles['expanded-detail-label']}>Links:</span>
                {item.Links.length > 0 ? (
                  <div className={styles['expanded-links-container']}>
                    {item.Links.map((link) => (
                      <a
                        key={link.Id}
                        href={link.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles['expanded-store-link']}
                      >
                        <Link size={12} style={{ marginRight: '4px' }} />
                        {getSiteName(link.Url, link.RetailerName)}
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className={styles['expanded-no-links']}>No links added yet.</span>
                )}
              </div>
            </div>
          </EnterPanel>
        )}


      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <Card
        className={`${styles['item-card']} ${styles['grid-card']} ${isSelected ? styles['selected-grid-card'] : ''} ${isFullyClaimed ? styles['claimed-card'] : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles['non-owner-claimed'] : ''} ${claimedByCurrentUser ? styles['user-claimed-card'] : ''} ${isTaggingModeActive ? styles['tagging-mode-card'] : ''} ${isTaggedSelection ? styles['tagged-card'] : ''}`}
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
            className={styles['tagging-card-click-overlay']}
            aria-label="Toggle selection"
          />
        )}

        {/* Pin button at top-left corner */}
        {!isOwner && (
          <button
            onClick={togglePin}
            className={`${styles['grid-pin-btn-absolute']} ${isPinned ? styles['pin-btn-active'] : ''}`}
            title={isPinned ? 'Unpin Item' : 'Pin Item'}
          >
            <Pin size={10} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
          </button>
        )}

        {/* Top bar with category and favorite indicator */}
        <div className={styles['grid-top-bar']}>
          <div className={styles['grid-category-container']}>
            {displayCategoryBadge && (
              <span className={styles['grid-category-badge']} title={`Category: ${categoryLabel}`}>
                <CategoryIcon size={10} />
              </span>
            )}
          </div>

          <div className={styles['grid-actions-container']}>
            {isOwner ? (
              <button
                type="button"
                onClick={toggleFavorite}
                className={`${styles['grid-star-btn']} ${isFavorite ? styles.active : ''}`}
                title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
                style={{ zIndex: 50 }}
              >
                <Star
                  size={10}
                  fill={isFavorite ? 'var(--warning)' : 'none'}
                  stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                />
              </button>
            ) : isFavorite ? (
              <div title="Favorited by Owner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={10} fill="var(--warning)" stroke="var(--warning)" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Main content */}
        <div className={styles['grid-content']}>
          <h4 className={styles['grid-item-name']} title={item.Name}>{item.Name}</h4>

          {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null ? (
            <div className={styles['grid-price-tag']}>${item.Links[0].ExtractedPrice}</div>
          ) : (
            <div className={styles['grid-no-price']}>—</div>
          )}
        </div>

        {/* Claim button at bottom center */}
        {!isOwner && (
          <div className={styles['grid-claim-container-absolute']}>
            {claimedByCurrentUser ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnclaim();
                }}
                disabled={claimLoading}
                className={`${styles['grid-mini-claim-btn']} ${styles['grid-mini-claimed']}`}
              >
                Unclaim
              </button>
            ) : isFullyClaimed ? (
              <span className={`${styles['grid-mini-claim-btn']} ${styles['grid-mini-claimed-disabled']}`}>
                Claimed
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClaimForm(true);
                }}
                className={styles['grid-mini-claim-btn']}
              >
                Claim
              </button>
            )}
          </div>
        )}

        {/* Mini claim confirmation overlay */}
        {showClaimForm && (
          <EnterPanel
            animation="fade"
            className={styles['grid-mini-overlay']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['grid-mini-overlay-prompt']}>Claim?</div>
            <div className={styles['grid-mini-overlay-actions']}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaim();
                }}
                disabled={claimLoading}
                className={styles['grid-mini-confirm-btn']}
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClaimForm(false);
                }}
                className={styles['grid-mini-cancel-btn']}
              >
                No
              </button>
            </div>
          </EnterPanel>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={`${styles['item-card']} ${isFullyClaimed ? styles['claimed-card'] : ''} ${isFullyClaimed && !isOwner && !claimedByCurrentUser ? styles['non-owner-claimed'] : ''} ${claimedByCurrentUser ? styles['user-claimed-card'] : ''} ${isTaggingModeActive ? styles['tagging-mode-card'] : ''} ${isTaggedSelection ? styles['tagged-card'] : ''}`}
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
          className={styles['tagging-card-click-overlay']}
          aria-label="Toggle selection"
        />
      )}

      {/* Circle Tagging Select Section (before the star) */}
      {isTaggingModeActive && (
        <>
          <div className={styles['card-select-section']}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectTag?.();
              }}
              className={`${styles['select-indicator-circle']} ${isTaggedSelection ? styles.checked : ''}`}
              aria-label={isTaggedSelection ? "Deselect item" : "Select item"}
            >
              {isTaggedSelection && <Check size={12} strokeWidth={3.5} />}
            </button>
          </div>
          <div className={styles['card-divider']}></div>
        </>
      )}

      {/* Left Section - Favorite Star */}
      <>
        <div className={styles['card-left-section']}>
          {isOwner ? (
            <button
              onClick={toggleFavorite}
              className={`${styles['card-action-btn']} ${styles['star-btn']} ${isFavorite ? styles.active : ''}`}
              title="Toggle favorite"
            >
              <Star
                size={20}
                fill={isFavorite ? 'var(--warning)' : 'none'}
                stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
              />
            </button>
          ) : isFavorite ? (
            <div
              title="Favorited by Owner"
              style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Star size={20} fill="var(--warning)" stroke="var(--warning)" />
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
              className={`${styles['pin-btn-left-section']} ${isPinned ? styles['pin-btn-active'] : ''}`}
              title={isPinned ? 'Unpin Item' : 'Pin Item'}
            >
              <Pin size={16} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
            </button>
          )}
        </div>
        <div className={styles['card-divider']}></div>
      </>

      {/* Main Content Area */}
      <div className={styles['card-main-content']}>
        <div className={styles['item-info']}>
          <div className={styles['item-title-row']}>
            <span className={styles['item-name']}>{item.Name}</span>
            <div className={styles['item-title-right']}>
              {item.Links.length > 0 && item.Links[0].ExtractedPrice !== null && (
                <span className={styles['main-price-tag']}>${item.Links[0].ExtractedPrice}</span>
              )}
              {claimedByCurrentUser && (
                <span className={styles['my-claim-badge']} title="You have claimed this item">
                  🎁 You claimed this!
                </span>
              )}
            </div>
          </div>
          {displayDescription && <p className={styles['item-description']}>{displayDescription}</p>}

          <div className={styles['item-meta']}>
            {displayCategoryBadge && (
              <span className={styles['category-badge']} title={`Category: ${categoryLabel}`}>
                <CategoryIcon size={12} style={{ marginRight: '4px' }} />
                {categoryLabel}
              </span>
            )}
          </div>

          {metadata && (
            <div className={styles['metadata-grid']}>
              {metadata.pantsSize && (
                <span className={styles['metadata-badge']} title="Pants Size">
                  👖 Pants: {metadata.pantsSize}
                </span>
              )}
              {metadata.shirtSize && (
                <span className={styles['metadata-badge']} title="Shirt Size">
                  👕 Shirt: {metadata.shirtSize}
                </span>
              )}
              {metadata.shoesSize && (
                <span className={styles['metadata-badge']} title="Shoes Size">
                  👟 Shoes: {metadata.shoesSize}
                </span>
              )}
              {metadata.socksSize && (
                <span className={styles['metadata-badge']} title="Socks Size">
                  🧦 Socks: {metadata.socksSize}
                </span>
              )}
              {metadata.color && (
                <span className={styles['metadata-badge']} title="Color">
                  🎨 Color: {metadata.color}
                </span>
              )}
              {metadata.custom?.map((f: any, idx: number) => (
                <span key={idx} className={styles['metadata-badge']} title={f.name}>
                  {f.name}: {f.value}
                </span>
              ))}
            </div>
          )}

          {item.IsHiddenIdea && !item.IsSuggestion && (
            <span className={styles['idea-badge']}>Collaborator Suggestion (Hidden from list owner)</span>
          )}
          {item.IsSuggestion && (
            <span className={styles['suggestion-badge']}>
              🎁 Suggestion by {item.SuggestedByUsername || 'Collaborator'}
            </span>
          )}
        </div>

        {/* Retail links list */}
        <div className={styles.section}>
          <div className={styles['section-header']}>
            <h5>Links</h5>
            {!isOwner && canCollaborate && (
              <button
                onClick={() => setShowAddLink(!showAddLink)}
                className={styles['add-link-toggle']}
              >
                <Plus size={14} /> Add Link
              </button>
            )}
          </div>

          {showAddLink && (
            <form onSubmit={handleAddLink} className={styles['link-form']}>
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
                className={styles['link-input']}
              />
              <Button type="submit" variant="secondary" size="sm" isLoading={linkLoading}>
                Add
              </Button>
            </form>
          )}

          {item.Links.length > 0 ? (
            <ul className={styles['links-list']}>
              {item.Links.map((link) => (
                <li key={link.Id} className={styles['link-item']}>
                  <a
                    href={link.Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['retailer-link']}
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
            <p className={styles['empty-text']}>No links added yet.</p>
          )}
        </div>

        {/* Group funding progress */}
        {allowGroupFunds && totalExtractedPrice > 0 && (
          <div className={styles.section}>
            <div className={styles['funding-header']}>
              <span>Group Funding Progress</span>
              <span>
                ${totalClaimedAmount.toFixed(2)} / ${totalExtractedPrice.toFixed(2)}
              </span>
            </div>
            <div className={styles['progress-bar-bg']}>
              <div
                className={styles['progress-bar-fill']}
                style={{
                  width: `${Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Claim confirmation dropdown */}
        {showClaimForm && (
          <EnterPanel animation="dropdown" className={styles['claim-confirmation-dropdown']}>
            <div className={styles['confirm-prompt']}>Are you sure you want to claim this item?</div>
            <div className={styles['confirm-actions-row']}>
              <div className={styles['confirm-left']}>
                <label className={styles['anon-label']}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <span>Anonymous</span>
                </label>
                {allowGroupFunds && totalExtractedPrice > 0 && (
                  <div className={styles['confirm-fund-wrapper']}>
                    <label className={styles['fund-label']}>Amount:</label>
                    <input
                      type="number"
                      min="1"
                      max={totalExtractedPrice - totalClaimedAmount}
                      placeholder="Amt"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className={styles['fund-input-small']}
                    />
                  </div>
                )}
              </div>
              <div className={styles['confirm-buttons']}>
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
          </EnterPanel>
        )}
      </div>

      {/* Right Actions Section */}
      <div className={styles['card-right-section']}>
        {/* Center Actions Section */}
        <div className={styles['center-actions']}>
          {canCollaborate ? (
            <div className={styles['owner-actions']}>
              {!showDeleteConfirm && (
                <button
                  onClick={onEdit}
                  className={styles['edit-btn']}
                  title="Edit Item"
                >
                  <Edit2 size={16} />
                </button>
              )}
              {showDeleteConfirm ? (
                <EnterPanel animation="dropdown" className={styles['delete-confirm-box']}>
                  <span className={styles['delete-confirm-text']}>Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className={styles['delete-confirm-btn']}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className={styles['delete-cancel-btn']}
                  >
                    No
                  </button>
                </EnterPanel>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteLoading}
                  className={styles['delete-btn']}
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ) : null}
          {!isOwner && (
            <div className={styles['claim-status-button-box']}>
              {claimedByCurrentUser ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUnclaim}
                  isLoading={claimLoading}
                >
                  Unclaim
                </Button>
              ) : isFullyClaimed ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={true}
                >
                  Claimed
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowClaimForm(true)}
                >
                  Claim
                </Button>
              )}
            </div>
          )}
        </div>

        {item.Claims.length > 0 && (!isOwner || isExpired) && (
          <div className={styles['claimed-by-box']} title="Claim Details">
            <div className={styles['claimed-by-box-label']}>
              {allowGroupFunds ? 'Funded' : 'Claimed'}
            </div>
            <div className={styles['claimed-by-box-sub']}>by</div>
            <div className={styles['claimed-by-box-name']}>
              {item.Claims.map((c) => c.ClaimedByName || 'Anonymous').join(', ')}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
