import type { ItemCardModifierInput } from '../interfaces/item-card-modifier-input.interface';

export function buildItemCardModifierClasses(
  input: ItemCardModifierInput,
  styles: Record<string, string>
): string {
  const classes: string[] = [];

  if (input.isPrivate) classes.push(styles['view--private'] ?? '');
  if (input.isFullyClaimed) classes.push(styles['view--claimed'] ?? '');
  if (input.isSuggestion) classes.push(styles['view--suggestion'] ?? '');
  if (input.claimedByCurrentUser) classes.push(styles['view--user-claimed'] ?? '');
  if (input.isTaggedSelection) classes.push(styles['view--tagged'] ?? '');
  if (input.isSelected) classes.push(styles['view--selected'] ?? '');

  return classes.filter(Boolean).join(' ');
}

export function getClaimedGrayOutClass(
  isFullyClaimed: boolean,
  hasVisibleClaim: boolean,
  claimedByCurrentUser: boolean,
  sharedStyles: Record<string, string>,
  _isArchived = false,
  isMultiCount = false,
  isGroupFundingInProgress = false
): string {
  if (claimedByCurrentUser) {
    return '';
  }
  if (isFullyClaimed) {
    return sharedStyles['view--claimed-gray'] ?? '';
  }
  // Partial multi-count claims stay full color; single-qty claims still gray.
  if (hasVisibleClaim && !isMultiCount) {
    if (isGroupFundingInProgress) {
      return '';
    }
    return sharedStyles['view--claimed-gray'] ?? '';
  }
  return '';
}

export function getGroupFundingInProgressClass(
  isGroupFundingInProgress: boolean,
  sharedStyles: Record<string, string>
): string {
  return isGroupFundingInProgress
    ? (sharedStyles['view--group-funding'] ?? '')
    : '';
}

export function getUserClaimedHighlightClass(
  claimedByCurrentUser: boolean,
  sharedStyles: Record<string, string>
): string {
  if (claimedByCurrentUser) {
    return sharedStyles['view--user-claimed-highlight'] ?? '';
  }
  return '';
}

export function getClaimedByDisplayName(
  claims: { ClaimedByName: string | null; Anonymous?: boolean }[]
): string | null {
  const claim = claims.find((c) => !c.Anonymous && c.ClaimedByName);
  return claim?.ClaimedByName ?? null;
}
