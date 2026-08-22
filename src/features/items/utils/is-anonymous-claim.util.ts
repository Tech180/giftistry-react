import type { Claim } from '../interfaces/item-claim.interface';

export function isAnonymousClaim(
  claim: Pick<Claim, 'Anonymous' | 'ClaimedByName'>
): boolean {
  return Boolean(claim.Anonymous) || claim.ClaimedByName === 'Anonymous';
}
