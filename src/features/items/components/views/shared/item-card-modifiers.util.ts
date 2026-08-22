export interface ItemCardModifierInput {
  isPrivate: boolean;
  isFullyClaimed: boolean;
  claimedByCurrentUser: boolean;
  isOwner: boolean;
  isSuggestion?: boolean;
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
  if (input.isSuggestion) classes.push(styles['is-suggestion'] ?? '');
  if (input.claimedByCurrentUser) classes.push(styles['is-user-claimed'] ?? '');
  if (input.isTaggedSelection) classes.push(styles['is-tagged'] ?? '');
  if (input.isSelected) classes.push(styles['is-selected'] ?? '');

  return classes.filter(Boolean).join(' ');
}

export function getClaimedGrayOutClass(
  isFullyClaimed: boolean,
  hasVisibleClaim: boolean,
  claimedByCurrentUser: boolean,
  sharedStyles: Record<string, string>,
  _isArchived = false,
  isMultiCount = false
): string {
  if (claimedByCurrentUser) {
    return '';
  }
  if (isFullyClaimed) {
    return sharedStyles['claimed-gray-out'] ?? '';
  }
  // Partial multi-count claims stay full color; single-qty claims still gray.
  if (hasVisibleClaim && !isMultiCount) {
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

export function getClaimedByDisplayName(
  claims: { ClaimedByName: string | null; Anonymous?: boolean }[]
): string | null {
  const claim = claims.find((c) => !c.Anonymous && c.ClaimedByName);
  return claim?.ClaimedByName ?? null;
}
