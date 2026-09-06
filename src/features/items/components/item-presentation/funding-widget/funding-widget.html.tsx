import React from 'react';
import { Badge } from 'shared/ui';
import { isMoneyAmountAtLeast } from 'shared/utils/compare-money-amount.util';
import { FundingWidgetProps } from './interfaces/funding-widget-props.interface';
import styles from './funding-widget.module.css';

export const FundingWidget: React.FC<FundingWidgetProps> = ({
  totalExtractedPrice,
  totalClaimedAmount,
  label = 'Fund progress',
}) => {
  if (totalExtractedPrice <= 0) return null;

  const isFullyFunded = isMoneyAmountAtLeast(totalClaimedAmount, totalExtractedPrice);
  const pct = Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100);

  return (
    <div className={styles['funding-widget']}>
      <div className={styles['funding-header']}>
        <span>{label}</span>
        <span className={styles['funding-amount-row']}>
          {isFullyFunded ? (
            <Badge size="sm" tone="success" ariaLabel="Fully funded">
              Funded
            </Badge>
          ) : null}
          <span>
            ${totalClaimedAmount.toFixed(2)} / ${totalExtractedPrice.toFixed(2)}
          </span>
        </span>
      </div>
      <div className={styles['progress-bg']}>
        <div
          className={`${styles['progress-fill']} ${isFullyFunded ? styles['progress-fill-complete'] : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
