export interface ClaimBadgeEntry {
  key: string;
  userId: string | null;
  displayName: string;
  /** Consolidated Anonymous chip (other claimants / other viewers). */
  anonymous: boolean;
  /**
   * Current user’s own anonymous claim: show their avatar with a small “a” marker.
   * Only present in the viewing user’s own claim box.
   */
  anonymousMarker?: boolean;
}
