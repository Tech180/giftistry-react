import type { Claim } from '../interfaces/item-claim.interface';
import { isAnonymousClaim } from './is-anonymous-claim.util';

/**
 * Whether the current user’s existing claim(s) on this item are anonymous.
 * Used to pre-select the Anonymous toggle when reopening the claim form.
 */
export function resolveCurrentUserClaimIsAnonymous(
  claims: Pick<Claim, 'UserId' | 'Anonymous' | 'ClaimedByName'>[],
  currentUserId: string | null | undefined
): boolean {
  if (!currentUserId) {
    return false;
  }

  const ownClaims = claims.filter((claim) => claim.UserId === currentUserId);
  if (ownClaims.length === 0) {
    return false;
  }

  return ownClaims.some(isAnonymousClaim);
}
