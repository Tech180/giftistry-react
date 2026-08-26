import type { Claim } from './item-claim.interface';

/** Claim chrome flags for a parent + substitution browse group. */
export interface SubstitutionGroupClaimChrome {
  /** Claims belonging to the active browse section (for badges). */
  claimsForBadge: Claim[];
  /**
   * True when the active section has claims, or another section in the group
   * does (used with getClaimedGrayOutClass for sibling gray-out).
   */
  hasVisibleClaimForGray: boolean;
  /**
   * True when the active section is fully claimed, or another section in the
   * group is (so siblings stay grayed for single-qty / fully claimed groups).
   */
  isFullyClaimedForChrome: boolean;
  /** True only when the current user claimed the active section. */
  claimedByCurrentUser: boolean;
  /**
   * True when the active section itself is not claimed, but a sibling section
   * locks the group (claim button should read Unavailable).
   */
  isUnavailableDueToSiblingClaim: boolean;
}
