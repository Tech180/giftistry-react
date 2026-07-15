import React from 'react';
import { FundingWidgetProps } from './interfaces/funding-widget-props.interface';
import styles from './funding-widget.module.css';

export const FundingWidget: React.FC<FundingWidgetProps> = ({
  totalExtractedPrice,
  totalClaimedAmount,
  label = 'Fund progress',
}) => {
  if (totalExtractedPrice <= 0) return null;

  const pct = Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100);

  return (
    <div className={styles['funding-widget']}>
      <div className={styles['funding-header']}>
        <span>{label}</span>
        <span>
          ${totalClaimedAmount.toFixed(2)} / ${totalExtractedPrice.toFixed(2)}
        </span>
      </div>
      <div className={styles['progress-bg']}>
        <div className={styles['progress-fill']} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
