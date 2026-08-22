import type { Claim } from '../interfaces/item-claim.interface';
import type { ItemClaimBadgeState } from '../interfaces/item-claim-badge-state.interface';
import {
  resolveClaimBadgeEntries,
  shouldShowClaimBadgeEntries,
} from './resolve-claim-badge-entries.util';

export function resolveItemClaimBadgeState(
  claims: Pick<Claim, 'Id' | 'UserId' | 'ClaimedByName' | 'Anonymous'>[],
  currentUserId: string | null | undefined,
  claimedByCurrentUser: boolean,
  claimActorName?: string | null
): ItemClaimBadgeState {
  const entries = resolveClaimBadgeEntries(claims, currentUserId, claimActorName);
  return {
    entries,
    showClaimBadge: shouldShowClaimBadgeEntries(
      entries,
      currentUserId,
      claimedByCurrentUser,
      claims
    ),
    hasVisibleClaim: entries.length > 0,
  };
}
