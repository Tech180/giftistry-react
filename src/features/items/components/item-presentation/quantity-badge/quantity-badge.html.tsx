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
  const remaining = Math.max(0, quantity.desiredQuantity - quantity.claimedQuantity);
  if (!quantity.shouldDisplay) return null;
  if (!isOwner && remaining <= 0) return null;

  const label = formatItemQuantityBadge(quantity, isOwner);
  const classNames = [styles.quantity, className].filter(Boolean).join(' ');
  const title = isOwner
    ? `Quantity ${quantity.desiredQuantity}`
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
