import React from 'react';
import { isMoneyAmountAtLeast } from 'shared/utils/compare-money-amount.util';
import type { Props } from './interfaces/props.interface';
import { FundingWidgetTemplate } from './funding-widget.html';

export const FundingWidget: React.FC<Props> = ({
  totalExtractedPrice,
  totalClaimedAmount,
  label = 'Fund progress',
}) => {
  if (totalExtractedPrice <= 0) {
    return null;
  }

  const isFullyFunded = isMoneyAmountAtLeast(totalClaimedAmount, totalExtractedPrice);
  const pct = Math.min(100, (totalClaimedAmount / totalExtractedPrice) * 100);
  const amountText = `$${totalClaimedAmount.toFixed(2)} / $${totalExtractedPrice.toFixed(2)}`;

  return (
    <FundingWidgetTemplate
      label = {
        label
      }
      amountText = {
        amountText
      }
      pct = {
        pct
      }
      isFullyFunded = {
        isFullyFunded
      }
    />
  );
};
