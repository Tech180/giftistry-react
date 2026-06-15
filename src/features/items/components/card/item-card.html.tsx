import React from 'react';
import { ExternalLink, Plus, Gift, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button, Card, Input } from 'shared/ui';
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
}) => {
  return (
    <Card className={`${styles.itemCard} ${isFullyClaimed ? styles.claimedCard : ''}`} padding="md" glass={true}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.itemName}>{item.Name}</h4>
          {item.Description && <p className={styles.itemDescription}>{item.Description}</p>}
          {item.IsHiddenIdea && (
            <span className={styles.ideaBadge}>Collaborator Suggestion (Hidden from list owner)</span>
          )}
        </div>

        {/* Claim status badge */}
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
      </div>

      {/* Retail links list */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h5>Purchasing Links</h5>
          {canCollaborate && (
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
                >
                  <ExternalLink size={12} />
                  <span>
                    {link.RetailerName || 'View Store'} 
                    {link.ExtractedPrice !== null && ` - $${link.ExtractedPrice}`}
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

      {/* Claims list & actions */}
      <div className={styles.section}>
        <h5>Claims</h5>
        {isOwner && !isExpired ? (
          <div className={styles.claimsMysteryBox}>
            <ShieldAlert size={16} />
            <span>Claims are hidden to preserve the surprise until list expires.</span>
          </div>
        ) : (
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

            {!isOwner && !isFullyClaimed && (
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
        )}
      </div>
    </Card>
  );
};
