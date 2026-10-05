import type { ListDisplayFundingFilter } from '../interfaces/list-display-funding-filter.type';
import type { Item } from '../interfaces/item.interface';
import {
  isItemGroupFundingFullyFunded,
  isItemGroupFundingInProgress,
  resolveItemFundingSnapshot,
} from './is-item-group-funding-active.util';

export function resolveListFundingFilterState(
  item: Item,
  allowGroupFunds: boolean
): Exclude<ListDisplayFundingFilter, 'all'> {
  const snapshot = resolveItemFundingSnapshot(item);
  if (snapshot.fundingTarget <= 0 || !allowGroupFunds) {
    return 'none';
  }

  const fullyFunded = isItemGroupFundingFullyFunded({
    allowGroupFunds,
    fundingTarget: snapshot.fundingTarget,
    totalClaimedAmount: snapshot.totalClaimedAmount,
    isFullyClaimed: item.IsFullyClaimed === true,
  });
  if (fullyFunded) {
    return 'fully_funded';
  }

  if (snapshot.totalClaimedAmount <= 0) {
    return 'not_started';
  }

  if (
    isItemGroupFundingInProgress({
      allowGroupFunds,
      fundingTarget: snapshot.fundingTarget,
      totalClaimedAmount: snapshot.totalClaimedAmount,
      isFullyClaimed: item.IsFullyClaimed === true,
    })
  ) {
    return 'in_progress';
  }

  return 'not_started';
}
