import React from 'react';
import { DollarSign } from 'lucide-react';
import { Switch } from 'shared/ui';
import { ClaimAnonymousToggle } from '../claim-anonymous-toggle/claim-anonymous-toggle.html';
import {
  CLAIM_GF_AMOUNT_LABEL,
  CLAIM_GF_AMOUNT_PLACEHOLDER,
  CLAIM_GF_CONTRIBUTE_LABEL,
  CLAIM_GF_REMAINING_HELPER,
  CLAIM_GF_START_LABEL,
} from './constants/claim-group-fund-copy.constant';
import { ClaimPromptProps } from './interfaces/claim-prompt-props.interface';
import styles from './claim-prompt.module.css';

export const ClaimPrompt: React.FC<ClaimPromptProps> = ({
  anonymous,
  onAnonymousChange,
  prompt = 'Claim this item?',
  showGroupFunding = false,
  groupFundingStarted = false,
  groupFundingEnabled = false,
  onGroupFundingEnabledChange,
  claimAmount = '',
  onClaimAmountChange,
  remainingAmount = 0,
  amountInputId = 'claim-group-fund-amount',
}) => {
  const gfPathActive = showGroupFunding && (groupFundingStarted || groupFundingEnabled);
  const gfToggleLabel = groupFundingStarted ? CLAIM_GF_CONTRIBUTE_LABEL : CLAIM_GF_START_LABEL;

  return (
    <div className={styles['claim-prompt-block']}>
      <span className={styles['claim-prompt-text']}>{prompt}</span>
      <ClaimAnonymousToggle checked={anonymous} onChange={onAnonymousChange} />
      {showGroupFunding && (
        <div className={styles['claim-gf-block']}>
          <div className={styles['claim-gf-toggle-row']}>
            <span className={styles['claim-gf-toggle-label']}>{gfToggleLabel}</span>
            <Switch
              checked={groupFundingStarted || groupFundingEnabled}
              disabled={groupFundingStarted}
              onChange={(checked) => onGroupFundingEnabledChange?.(checked)}
              size="sm"
              aria-label={gfToggleLabel}
            />
          </div>
          {gfPathActive && (
            <div className={styles['claim-gf-amount']}>
              <label className={styles['claim-gf-amount-label']} htmlFor={amountInputId}>
                {CLAIM_GF_AMOUNT_LABEL}
              </label>
              <div className={styles['claim-gf-amount-field']}>
                <span className={styles['claim-gf-amount-icon']} aria-hidden>
                  <DollarSign size={16} />
                </span>
                <input
                  id={amountInputId}
                  className={styles['claim-gf-amount-input']}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  max={remainingAmount > 0 ? remainingAmount : undefined}
                  value={claimAmount}
                  onChange={(event) => onClaimAmountChange?.(event.target.value)}
                  placeholder={CLAIM_GF_AMOUNT_PLACEHOLDER}
                  required
                  aria-describedby={`${amountInputId}-hint`}
                />
              </div>
              <p id={`${amountInputId}-hint`} className={styles['claim-gf-amount-hint']}>
                {CLAIM_GF_REMAINING_HELPER(remainingAmount)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
