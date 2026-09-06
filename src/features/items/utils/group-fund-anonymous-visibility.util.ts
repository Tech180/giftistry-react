import type { Claim } from '../interfaces/item-claim.interface';

export function isGroupFundContribution(claim: Pick<Claim, 'Amount'>): boolean {
  return claim.Amount != null && Number(claim.Amount) > 0;
}

export function getGroupFundContributorUserIds(
  claims: Pick<Claim, 'UserId' | 'Amount'>[]
): Set<string> {
  const contributorIds = new Set<string>();
  for (const claim of claims) {
    if (isGroupFundContribution(claim) && claim.UserId) {
      contributorIds.add(claim.UserId);
    }
  }
  return contributorIds;
}

export function shouldRevealAnonymousClaimToViewer(
  claim: Pick<Claim, 'UserId' | 'Amount' | 'Anonymous'>,
  viewerUserId: string | null | undefined,
  contributorUserIds: Set<string>
): boolean {
  if (!claim.Anonymous) {
    return true;
  }
  if (!claim.UserId) {
    return false;
  }
  if (viewerUserId && claim.UserId === viewerUserId) {
    return true;
  }
  if (!isGroupFundContribution(claim)) {
    return false;
  }
  return (
    !!viewerUserId &&
    contributorUserIds.has(viewerUserId) &&
    contributorUserIds.has(claim.UserId)
  );
}
