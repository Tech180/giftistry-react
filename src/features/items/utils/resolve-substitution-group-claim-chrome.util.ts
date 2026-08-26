import type { Claim } from '../interfaces/item-claim.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import type { SubstitutionGroupClaimChrome } from '../interfaces/substitution-group-claim-chrome.interface';
import {
  resolveItemSubstitutionOptions,
  type SubstitutionBrowseOption,
} from './resolve-item-substitution-options.util';

function sectionHasClaims(claims: Claim[] | null | undefined): boolean {
  return (claims?.length ?? 0) > 0;
}

function resolveSectionClaims(
  parent: Item,
  entry: SubstitutionBrowseOption
): Claim[] {
  if (entry.kind === 'original') {
    return parent.Claims ?? [];
  }
  return entry.option?.Item.Claims ?? [];
}

function resolveSectionIsFullyClaimed(
  parent: Item,
  entry: SubstitutionBrowseOption,
  isMultiCount: boolean
): boolean {
  if (entry.kind === 'original') {
    if (parent.IsFullyClaimed != null) return parent.IsFullyClaimed;
    if (isMultiCount) return false;
    return parent.IsClaimed || sectionHasClaims(parent.Claims);
  }

  const child = entry.option?.Item;
  if (!child) return false;
  if (child.IsFullyClaimed != null) return child.IsFullyClaimed;
  if (isMultiCount) return false;
  return child.IsClaimed || sectionHasClaims(child.Claims);
}

export interface ResolveSubstitutionGroupClaimChromeInput {
  parent: Item;
  options: ItemSubstitutionOption[] | null | undefined;
  active: SubstitutionBrowseOption;
  userId: string | null | undefined;
  isMultiCount: boolean;
}

/** Group-aware claim flags so sibling sections stay grayed when one is claimed. */
export function resolveSubstitutionGroupClaimChrome(
  input: ResolveSubstitutionGroupClaimChromeInput
): SubstitutionGroupClaimChrome {
  const { parent, options, active, userId, isMultiCount } = input;
  const browse = resolveItemSubstitutionOptions(parent, options);
  const claimsForBadge = resolveSectionClaims(parent, active);
  const claimedByCurrentUser = !!(
    userId && claimsForBadge.some((claim) => claim.UserId === userId)
  );

  const activeFullyClaimed = resolveSectionIsFullyClaimed(parent, active, isMultiCount);
  const activeHasClaim = sectionHasClaims(claimsForBadge);

  let siblingFullyClaimed = false;
  let siblingHasClaim = false;
  for (const entry of browse) {
    if (entry.itemId === active.itemId) continue;
    if (resolveSectionIsFullyClaimed(parent, entry, isMultiCount)) {
      siblingFullyClaimed = true;
    }
    if (sectionHasClaims(resolveSectionClaims(parent, entry))) {
      siblingHasClaim = true;
    }
  }

  return {
    claimsForBadge,
    claimedByCurrentUser,
    isFullyClaimedForChrome: activeFullyClaimed || siblingFullyClaimed,
    hasVisibleClaimForGray: activeHasClaim || siblingHasClaim,
    isUnavailableDueToSiblingClaim: siblingFullyClaimed && !activeFullyClaimed,
  };
}
