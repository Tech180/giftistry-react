import type { Claim } from '../interfaces/item-claim.interface';
import type { ClaimBadgeEntry } from '../interfaces/claim-badge-entry.interface';
import { isAnonymousClaim } from './is-anonymous-claim.util';
import {
  getGroupFundContributorUserIds,
  shouldRevealAnonymousClaimToViewer,
} from './group-fund-anonymous-visibility.util';

/**
 * Build claim-box entries: one per named UserId, plus a single consolidated anonymous chip.
 * The current user’s anonymous claim is shown as their own avatar with an “a” marker instead
 * of being folded into the Anonymous chip (other viewers still see only the chip).
 * Fellow group-fund contributors see each other's full names even when marked anonymous.
 */
export function resolveClaimBadgeEntries(
  claims: Pick<Claim, 'Id' | 'UserId' | 'ClaimedByName' | 'Anonymous' | 'Amount'>[],
  currentUserId?: string | null,
  claimActorName?: string | null
): ClaimBadgeEntry[] {
  const contributorUserIds = getGroupFundContributorUserIds(claims);
  const entries: ClaimBadgeEntry[] = [];
  const seenUserIds = new Set<string>();
  let hasOtherAnonymous = false;

  for (const claim of claims) {
    if (isAnonymousClaim(claim)) {
      if (currentUserId && claim.UserId === currentUserId) {
        if (seenUserIds.has(currentUserId)) {
          continue;
        }
        seenUserIds.add(currentUserId);
        entries.push({
          key: currentUserId,
          userId: currentUserId,
          displayName: claimActorName?.trim() || 'You',
          anonymous: false,
          anonymousMarker: true,
        });
        continue;
      }

      if (
        shouldRevealAnonymousClaimToViewer(claim, currentUserId, contributorUserIds) &&
        claim.UserId
      ) {
        if (seenUserIds.has(claim.UserId)) {
          continue;
        }
        seenUserIds.add(claim.UserId);
        entries.push({
          key: claim.UserId,
          userId: claim.UserId,
          displayName: claim.ClaimedByName?.trim() || 'Someone',
          anonymous: false,
        });
        continue;
      }

      hasOtherAnonymous = true;
      continue;
    }

    if (!claim.UserId || seenUserIds.has(claim.UserId)) {
      continue;
    }

    seenUserIds.add(claim.UserId);
    entries.push({
      key: claim.UserId,
      userId: claim.UserId,
      displayName: claim.ClaimedByName?.trim() || 'Someone',
      anonymous: false,
    });
  }

  if (hasOtherAnonymous) {
    entries.push({
      key: 'anonymous',
      userId: null,
      displayName: 'Anonymous',
      anonymous: true,
    });
  }

  return entries;
}

/**
 * Show the claim box when there are claimants, except when the current user
 * is the sole claimant (their card uses the green “my claim” highlight instead).
 */
export function shouldShowClaimBadgeEntries(
  entries: ClaimBadgeEntry[],
  currentUserId: string | null | undefined,
  claimedByCurrentUser: boolean,
  claims: Pick<Claim, 'UserId'>[]
): boolean {
  if (entries.length === 0) {
    return false;
  }

  if (!claimedByCurrentUser || !currentUserId) {
    return true;
  }

  const onlyCurrentUser = claims.every((claim) => claim.UserId === currentUserId);
  return !onlyCurrentUser;
}
