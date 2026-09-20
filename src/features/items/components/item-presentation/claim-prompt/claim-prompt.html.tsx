import React from 'react';
import { DollarSign } from 'lucide-react';
import { Switch } from 'shared/ui';
import { ClaimAnonymousToggle } from '../claim-anonymous-toggle/claim-anonymous-toggle.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './claim-prompt.module.css';

export const ClaimPromptTemplate: React.FC<TemplateProps> = ({
  anonymous,
  onAnonymousChange,
  prompt,
  showGroupFunding,
  gfPathActive,
  gfToggleLabel,
  switchChecked,
  switchDisabled,
  onGroupFundingEnabledChange,
  claimAmount,
  onClaimAmountChange,
  remainingHint,
  amountLabel,
  amountPlaceholder,
  amountInputId,
  amountMax,
}) => {
  return (
    <div className={styles['claim-prompt']}>
      <span className={styles['claim-prompt__text']}>{prompt}</span>
      <ClaimAnonymousToggle checked={anonymous} onChange={onAnonymousChange} />
      {showGroupFunding ? (
        <div className={styles['claim-prompt__gf']}>
          <div className={styles['claim-prompt__gf-toggle-row']}>
            <span className={styles['claim-prompt__gf-toggle-label']}>{gfToggleLabel}</span>
            <Switch
              checked={switchChecked}
              disabled={switchDisabled}
              onChange={(checked) => onGroupFundingEnabledChange?.(checked)}
              size="sm"
              aria-label={gfToggleLabel}
            />
          </div>
          {gfPathActive ? (
            <div className={styles['claim-prompt__gf-amount']}>
              <label className={styles['claim-prompt__gf-amount-label']} htmlFor={amountInputId}>
                {amountLabel}
              </label>
              <div className={styles['claim-prompt__gf-amount-field']}>
                <span className={styles['claim-prompt__gf-amount-icon']} aria-hidden>
                  <DollarSign size={16} />
                </span>
                <input
                  id={amountInputId}
                  className={styles['claim-prompt__gf-amount-input']}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  max={amountMax}
                  value={claimAmount}
                  onChange={(event) => onClaimAmountChange?.(event.target.value)}
                  placeholder={amountPlaceholder}
                  required
                  aria-describedby={`${amountInputId}-hint`}
                />
              </div>
              <p id={`${amountInputId}-hint`} className={styles['claim-prompt__gf-amount-hint']}>
                {remainingHint}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
