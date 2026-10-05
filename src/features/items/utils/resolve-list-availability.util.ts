import type { Item } from '../interfaces/item.interface';
import {
  resolveActiveItemFullyClaimed,
  resolveItemFundingSnapshot,
} from './is-item-group-funding-active.util';

export function isListItemClaimedForFilter(
  item: Item,
  allowGroupFunds: boolean
): boolean {
  const snapshot = resolveItemFundingSnapshot(item);
  const desiredQuantity = item.DesiredQuantity ?? 1;
  const claimedQuantity = item.TotalClaimedQuantity ?? (item.IsClaimed ? 1 : 0);

  return resolveActiveItemFullyClaimed({
    isFullyClaimed: item.IsFullyClaimed,
    isClaimed: item.IsClaimed,
    allowGroupFunds,
    fundingTarget: snapshot.fundingTarget,
    totalClaimedAmount: snapshot.totalClaimedAmount,
    isMultiCount: item.IsMultiCount === true,
    claimedQuantity,
    desiredQuantity,
  });
}
