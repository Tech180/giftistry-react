import type { Item } from '../interfaces/item.interface';
import type {
  CompactCategoryColumnPresence,
  CompactCategoryColumnPresenceOptions,
} from '../interfaces/compact-category-column-presence.interface';
import { shouldShowSharingAvatars } from './item-audience.util';
import { getLinkedItemIds } from './item-links-sync.util';
import { getRelatedItemIds } from './item-related-sync.util';
import { resolveItemClaimBadgeState } from './resolve-item-claim-badge-state.util';
import { itemNeedsClaimQuantityUi } from './resolve-claim-quantity-lines.util';
import { resolveItemQuantitySummary } from './resolve-item-quantity.util';
import { isItemGroupFundingActiveOnItemTree } from './is-item-group-funding-active.util';

function itemShowsQuantity(item: Item, isOwner: boolean): boolean {
  const quantity = resolveItemQuantitySummary(item);
  if (!quantity.shouldDisplay) {
    return false;
  }
  if (isOwner) {
    return true;
  }
  const remaining = Math.max(0, quantity.desiredQuantity - quantity.claimedQuantity);
  return remaining > 0;
}

function itemShowsClaimBadge(item: Item, currentUserId?: string | null): boolean {
  const claimedByCurrentUser = !!(
    currentUserId && item.Claims.some((claim) => claim.UserId === currentUserId)
  );
  return resolveItemClaimBadgeState(
    item.Claims,
    currentUserId,
    claimedByCurrentUser
  ).showClaimBadge;
}

function itemShowsTrailing(item: Item, canShowTrailingActions: boolean): boolean {
  return !!item.Links[0] || canShowTrailingActions;
}

function itemShowsRelations(item: Item): boolean {
  return getLinkedItemIds(item).length > 0 || getRelatedItemIds(item).length > 0;
}

function itemShowsWideClaimActions(
  item: Item,
  options: CompactCategoryColumnPresenceOptions
): boolean {
  const { isOwner, currentUserId = null, canShowTrailingActions = false } = options;
  if (isOwner || !canShowTrailingActions || !currentUserId) {
    return false;
  }
  const claimedByCurrentUser = item.Claims.some((claim) => claim.UserId === currentUserId);
  if (!claimedByCurrentUser) {
    return false;
  }
  return itemNeedsClaimQuantityUi(item);
}

export function resolveCompactCategoryColumnPresence(
  items: Item[],
  options: CompactCategoryColumnPresenceOptions
): CompactCategoryColumnPresence {
  const {
    allowGroupFunds,
    isTaggingModeActive,
    isOwner,
    currentUserId = null,
    canShowTrailingActions = false,
  } = options;

  return {
    leading: true,
    select: isTaggingModeActive,
    relations: items.some((item) => itemShowsRelations(item)),
    audience: items.some(
      (item) =>
        !!item.IsSuggestion ||
        itemShowsClaimBadge(item, currentUserId) ||
        shouldShowSharingAvatars(item, isOwner, currentUserId ?? undefined)
    ),
    quantity: items.some((item) => itemShowsQuantity(item, isOwner)),
    price: true,
    funding: allowGroupFunds && items.some((item) => isItemGroupFundingActiveOnItemTree(item, true)),
    trailing: items.some((item) => itemShowsTrailing(item, canShowTrailingActions)),
    claimActions: !isOwner && canShowTrailingActions,
    wideClaimActions: items.some((item) => itemShowsWideClaimActions(item, options)),
  };
}
