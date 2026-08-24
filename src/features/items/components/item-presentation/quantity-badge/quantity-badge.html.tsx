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
  isOwner = false,
  className,
}) => {
  const quantity = resolveItemQuantitySummary(item, metadata);
  if (!quantity.shouldDisplay) return null;

  const isUnlimited = quantity.desiredQuantity === 0;
  const remaining = isUnlimited
    ? null
    : Math.max(0, quantity.desiredQuantity - quantity.claimedQuantity);
  if (!isOwner && remaining !== null && remaining <= 0) return null;

  const label = formatItemQuantityBadge(quantity, isOwner);
  const classNames = [styles.quantity, className].filter(Boolean).join(' ');
  const title = isOwner
    ? isUnlimited
      ? 'Unlimited quantity'
      : `Quantity ${quantity.desiredQuantity}`
    : isUnlimited
      ? 'Unlimited remaining'
      : `${remaining} left`;

  return (
    <span
      className={classNames}
      title={title}
      aria-label={`Quantity ${label}`}
    >
      {label}
    </span>
  );
};
