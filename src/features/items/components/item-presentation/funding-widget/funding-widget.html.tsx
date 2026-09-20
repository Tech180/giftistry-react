import React from 'react';
import { Badge } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './funding-widget.module.css';

export const FundingWidgetTemplate: React.FC<TemplateProps> = ({
  label,
  amountText,
  pct,
  isFullyFunded,
}) => {
  return (
    <div className={styles['funding-widget']}>
      <div className={styles['funding-widget__header']}>
        <span>{label}</span>
        <span className={styles['funding-widget__amount-row']}>
          {isFullyFunded ? (
            <Badge size="sm" tone="success" ariaLabel="Fully funded">
              Funded
            </Badge>
          ) : null}
          <span>{amountText}</span>
        </span>
      </div>
      <div className={styles['funding-widget__progress']}>
        <div
          className={[
            styles['funding-widget__progress-fill'],
            isFullyFunded ? styles['funding-widget__progress-fill--complete'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
