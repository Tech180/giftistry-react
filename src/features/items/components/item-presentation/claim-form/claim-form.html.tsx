import React from 'react';
import { Button, NumberSelector } from 'shared/ui';
import { ClaimAnonymousToggle } from '../claim-anonymous-toggle/claim-anonymous-toggle.html';
import { ClaimPrompt } from '../claim-prompt/claim-prompt.html';
import { CLAIM_FORM_QUANTITY_LABEL } from './constants/claim-form-copy.constant';
import type { ClaimFormTemplateProps } from './interfaces/claim-form-template-props.interface';
import styles from './claim-form.module.css';

export const ClaimFormTemplate: React.FC<ClaimFormTemplateProps> = ({
  prompt,
  title,
  confirmLabel,
  anonymous,
  onAnonymousChange,
  compact,
  showQuantityUi,
  showVariationList,
  quantityRows,
  totalRemaining,
  confirmDisabled,
  confirmLoading,
  onQuantityChange,
  onSubmit,
  onCancel,
}) => {
  const formClass = [
    styles['claim-form'],
    compact ? styles['claim-form-compact'] : '',
    compact && !showQuantityUi ? styles['claim-form-compact-row'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const inlineRow = !showVariationList ? quantityRows[0] : undefined;

  return (
    <form
      className={formClass}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSubmit();
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {showQuantityUi ? (
        <>
          <div className={styles['claim-drawer-header']}>
            <div className={styles['header-count']}>
              <div className={styles['drawer-total']} title="Amount left">
                {totalRemaining}
              </div>
              {inlineRow && (
                <NumberSelector
                  value={inlineRow.quantity}
                  min={0}
                  max={inlineRow.maxForUser}
                  onChange={(next) => onQuantityChange(inlineRow.selection, next)}
                  decreaseLabel={`Decrease ${CLAIM_FORM_QUANTITY_LABEL}`}
                  increaseLabel={`Increase ${CLAIM_FORM_QUANTITY_LABEL}`}
                  disabled={inlineRow.maxForUser <= 0 && inlineRow.quantity <= 0}
                />
              )}
            </div>
            <h4 className={styles['claim-drawer-title']}>{title}</h4>
          </div>
          {showVariationList && (
            <div className={styles['qty-list']}>
              {quantityRows.map((row) => {
                const rowClass = [
                  styles['qty-row'],
                  row.quantity > 0 ? styles['qty-row-active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                const hintClass = [
                  styles['qty-hint'],
                  row.outOfStock ? styles['qty-hint-out-of-stock'] : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={row.inputId} className={rowClass}>
                    <div className={styles['qty-info']}>
                      <span className={hintClass} aria-label={`${row.remaining} remaining`}>
                        {row.remaining}
                      </span>
                      <span className={styles['qty-label']} id={row.inputId}>
                        {row.name}
                      </span>
                    </div>
                    <NumberSelector
                      value={row.quantity}
                      min={0}
                      max={row.maxForUser}
                      onChange={(next) => onQuantityChange(row.selection, next)}
                      decreaseLabel={`Decrease ${row.name}`}
                      increaseLabel={`Increase ${row.name}`}
                      disabled={row.maxForUser <= 0 && row.quantity <= 0}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles['drawer-actions']}>
            <ClaimAnonymousToggle checked={anonymous} onChange={onAnonymousChange} />
            <div className={styles['action-group']}>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className={styles['drawer-action-btn']}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className={styles['drawer-action-btn']}
                isLoading={confirmLoading}
                disabled={confirmDisabled}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles['claim-simple-row']}>
          <ClaimPrompt
            anonymous={anonymous}
            onAnonymousChange={onAnonymousChange}
            prompt={prompt}
          />
          <div className={styles['form-actions']}>
            <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={confirmLoading}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
