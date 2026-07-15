export interface ItemCardModifierInput {
  isPrivate: boolean;
  isFullyClaimed: boolean;
  claimedByCurrentUser: boolean;
  isOwner: boolean;
  isTaggedSelection?: boolean;
  isSelected?: boolean;
}

export function buildItemCardModifierClasses(
  input: ItemCardModifierInput,
  styles: Record<string, string>
): string {
  const classes: string[] = [];

  if (input.isPrivate) classes.push(styles['is-private'] ?? '');
  if (input.isFullyClaimed) classes.push(styles['is-claimed'] ?? '');
  if (input.claimedByCurrentUser) classes.push(styles['is-user-claimed'] ?? '');
  if (input.isTaggedSelection) classes.push(styles['is-tagged'] ?? '');
  if (input.isSelected) classes.push(styles['is-selected'] ?? '');

  return classes.filter(Boolean).join(' ');
}

export function getClaimedGrayOutClass(
  isFullyClaimed: boolean,
  hasVisibleClaim: boolean,
  claimedByCurrentUser: boolean,
  sharedStyles: Record<string, string>
): string {
  if (claimedByCurrentUser) {
    return '';
  }
  if (isFullyClaimed || hasVisibleClaim) {
    return sharedStyles['claimed-gray-out'] ?? '';
  }
  return '';
}

export function getUserClaimedHighlightClass(
  claimedByCurrentUser: boolean,
  sharedStyles: Record<string, string>
): string {
  if (claimedByCurrentUser) {
    return sharedStyles['user-claimed-highlight'] ?? '';
  }
  return '';
}

export function shouldShowClaimBadge(
  primaryClaim: PrimaryClaimDisplay | null,
  claimedByCurrentUser: boolean
): primaryClaim is PrimaryClaimDisplay {
  return primaryClaim != null && !claimedByCurrentUser;
}

export function getClaimedByDisplayName(
  claims: { ClaimedByName: string | null; Anonymous?: boolean }[]
): string | null {
  const claim = claims.find((c) => !c.Anonymous && c.ClaimedByName);
  return claim?.ClaimedByName ?? null;
}

export interface PrimaryClaimDisplay {
  userId: string | null;
  displayName: string;
  anonymous: boolean;
}

export function getPrimaryClaimForBadge(
  claims: { UserId: string | null; ClaimedByName: string | null; Anonymous?: boolean }[]
): PrimaryClaimDisplay | null {
  if (claims.length === 0) {
    return null;
  }

  const visibleClaim =
    claims.find((c) => !c.Anonymous && c.UserId) ??
    claims.find((c) => c.Anonymous) ??
    claims.find((c) => c.UserId) ??
    claims.find((c) => c.ClaimedByName === 'Anonymous');

  if (!visibleClaim) {
    return null;
  }

  if (visibleClaim.Anonymous || visibleClaim.ClaimedByName === 'Anonymous') {
    return {
      userId: null,
      displayName: 'Anonymous',
      anonymous: true,
    };
  }

  return {
    userId: visibleClaim.UserId,
    displayName: visibleClaim.ClaimedByName?.trim() || 'Someone',
    anonymous: false,
  };
}
