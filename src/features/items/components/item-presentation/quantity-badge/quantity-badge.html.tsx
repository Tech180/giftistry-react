import React from 'react';
import {
  formatItemQuantityBadge,
  resolveItemQuantitySummary,
} from '../../../utils/resolve-item-quantity.util';
import { QuantityBadgeProps } from './interfaces/quantity-badge-props.interface';
import styles from './quantity-badge.module.css';

export const QuantityBadge: React.FC<QuantityBadgeProps> = ({
  item,
  metadata,
  className,
}) => {
  const quantity = resolveItemQuantitySummary(item, metadata);
  if (!quantity.shouldDisplay) return null;

  const label = formatItemQuantityBadge(quantity);
  const classNames = [styles.quantity, className].filter(Boolean).join(' ');

  return (
    <span
      className={classNames}
      title={`${quantity.claimedQuantity} of ${quantity.desiredQuantity} claimed`}
      aria-label={`Quantity ${label}`}
    >
      {label}
    </span>
  );
};
