import type { Claim } from '../interfaces/item-claim.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import type { SubstitutionGroupClaimChrome } from '../interfaces/substitution-group-claim-chrome.interface';
import {
  isBrowseSectionGfFullyFunded,
  resolveBrowseSectionFullyClaimed,
} from './resolve-item-section-fully-claimed.util';
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

export interface ResolveSubstitutionGroupClaimChromeInput {
  parent: Item;
  options: ItemSubstitutionOption[] | null | undefined;
  active: SubstitutionBrowseOption;
  userId: string | null | undefined;
  allowGroupFunds: boolean;
}

/** Group-aware claim flags so sibling sections stay grayed when one is claimed. */
export function resolveSubstitutionGroupClaimChrome(
  input: ResolveSubstitutionGroupClaimChromeInput
): SubstitutionGroupClaimChrome {
  const { parent, options, active, userId, allowGroupFunds } = input;
  const browse = resolveItemSubstitutionOptions(parent, options);
  const claimsForBadge = resolveSectionClaims(parent, active);
  const claimedByCurrentUser = !!(
    userId && claimsForBadge.some((claim) => claim.UserId === userId)
  );

  const activeFullyClaimed = resolveBrowseSectionFullyClaimed(
    parent,
    active,
    allowGroupFunds
  );
  const activeHasClaim = sectionHasClaims(claimsForBadge);
  const activeGfFullyFunded = isBrowseSectionGfFullyFunded(
    parent,
    active,
    allowGroupFunds
  );

  let siblingFullyClaimed = false;
  let siblingHasClaim = false;
  let siblingGfFullyFunded = false;
  for (const entry of browse) {
    if (entry.itemId === active.itemId) continue;
    if (resolveBrowseSectionFullyClaimed(parent, entry, allowGroupFunds)) {
      siblingFullyClaimed = true;
    }
    if (sectionHasClaims(resolveSectionClaims(parent, entry))) {
      siblingHasClaim = true;
    }
    if (isBrowseSectionGfFullyFunded(parent, entry, allowGroupFunds)) {
      siblingGfFullyFunded = true;
    }
  }

  return {
    claimsForBadge,
    claimedByCurrentUser,
    isFullyClaimedForChrome: activeFullyClaimed || siblingFullyClaimed,
    hasVisibleClaimForGray:
      activeHasClaim ||
      siblingHasClaim ||
      activeGfFullyFunded ||
      siblingGfFullyFunded,
    isUnavailableDueToSiblingClaim: siblingFullyClaimed && !activeFullyClaimed,
  };
}
