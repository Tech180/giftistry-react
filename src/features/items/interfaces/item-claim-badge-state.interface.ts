import type { ClaimBadgeEntry } from './claim-badge-entry.interface';

export interface ItemClaimBadgeState {
  entries: ClaimBadgeEntry[];
  showClaimBadge: boolean;
  hasVisibleClaim: boolean;
}
