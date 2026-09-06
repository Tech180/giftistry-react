import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { CLAIM_QUANTITY_GENERIC_NAME } from '../constants/claim-quantity-generic-name.constant';
import type { Claim } from '../interfaces/item-claim.interface';
import type { ClaimQuantityDraft } from '../interfaces/claim-quantity-draft.interface';
import type { ClaimQuantityLine } from '../interfaces/claim-quantity-line.interface';
import type { Item } from '../interfaces/item.interface';
import { resolveItemQuantitySummary } from './resolve-item-quantity.util';

function claimQuantity(claim: Claim): number {
  return claim.Quantity || 1;
}

function isCurrentUserClaim(claim: Claim, userId: string | null | undefined): boolean {
  return !!userId && claim.UserId === userId;
}

function claimSelectionKey(claim: Claim): string | null {
  const selection = claim.Selection;
  if (selection == null || selection.trim() === '') {
    return null;
  }
  return selection;
}

function sumMatchingClaims(
  claims: Claim[],
  userId: string | null | undefined,
  forCurrentUser: boolean,
  matches: (claim: Claim) => boolean
): number {
  return claims.reduce((sum, claim) => {
    const isUser = isCurrentUserClaim(claim, userId);
    if (forCurrentUser !== isUser || !matches(claim)) {
      return sum;
    }
    return sum + claimQuantity(claim);
  }, 0);
}

function toQuantityLine(
  selection: string | null,
  name: string,
  claimedByUser: number,
  claimedByOthers: number,
  capacity: number
): ClaimQuantityLine {
  return {
    selection,
    name,
    claimedByUser,
    claimedByOthers,
    capacity,
    maxForUser: Math.max(0, capacity - claimedByOthers),
  };
}

export function itemNeedsClaimQuantityUi(
  item: Item,
  metadata?: ItemDescriptionMetadata | null
): boolean {
  const meta = metadata ?? item.Metadata ?? null;
  const summary = resolveItemQuantitySummary(item, meta);
  const variations = meta?.Variations ?? [];
  return summary.isMultiCount || variations.length > 0;
}

export function isClaimQuantityLineVisible(line: ClaimQuantityLine): boolean {
  return line.claimedByUser > 0 || line.maxForUser > 0;
}

export function unclaimedUnitsOnClaimQuantityLine(line: ClaimQuantityLine): number {
  return Math.max(0, line.capacity - line.claimedByOthers - line.claimedByUser);
}

export function resolveClaimQuantityLines(
  item: Item,
  metadata?: ItemDescriptionMetadata | null,
  userId?: string | null
): ClaimQuantityLine[] {
  const meta = metadata ?? item.Metadata ?? null;
  const claims = item.Claims ?? [];
  const variations = meta?.Variations ?? [];
  const summary = resolveItemQuantitySummary(item, meta);

  if (variations.length === 0) {
    const claimedByUser = sumMatchingClaims(claims, userId, true, () => true);
    const claimedByOthers = sumMatchingClaims(claims, userId, false, () => true);
    const capacity =
      summary.desiredQuantity === 0
        ? Number.MAX_SAFE_INTEGER
        : summary.desiredQuantity;
    return [
      toQuantityLine(null, 'Quantity', claimedByUser, claimedByOthers, capacity),
    ];
  }

  const namedNames = new Set(variations.map((variation) => variation.Name));
  const namedLines = variations.map((variation) => {
    const matches = (claim: Claim) => claimSelectionKey(claim) === variation.Name;
    const claimedByUser = sumMatchingClaims(claims, userId, true, matches);
    const claimedByOthers = sumMatchingClaims(claims, userId, false, matches);
    const capacity =
      Number(variation.Quantity) === 0
        ? Number.MAX_SAFE_INTEGER
        : Math.max(0, Number(variation.Quantity) || 0);
    return toQuantityLine(
      variation.Name,
      variation.Name,
      claimedByUser,
      claimedByOthers,
      capacity
    );
  });

  const namedCapacity = namedLines.reduce((sum, line) => sum + line.capacity, 0);
  const leftover =
    summary.desiredQuantity === 0
      ? Number.MAX_SAFE_INTEGER
      : Math.max(0, summary.desiredQuantity - namedCapacity);
  const matchesGeneric = (claim: Claim) => {
    const key = claimSelectionKey(claim);
    return key == null || !namedNames.has(key);
  };
  const genericClaimedByUser = sumMatchingClaims(claims, userId, true, matchesGeneric);
  const genericClaimedByOthers = sumMatchingClaims(claims, userId, false, matchesGeneric);
  const genericCapacity = Math.max(leftover, genericClaimedByUser + genericClaimedByOthers);

  if (genericCapacity <= 0) {
    return namedLines;
  }

  return [
    ...namedLines,
    toQuantityLine(
      null,
      CLAIM_QUANTITY_GENERIC_NAME,
      genericClaimedByUser,
      genericClaimedByOthers,
      genericCapacity
    ),
  ];
}

export function buildInitialClaimDraft(lines: ClaimQuantityLine[]): ClaimQuantityDraft[] {
  const userHasClaims = lines.some((line) => line.claimedByUser > 0);
  if (userHasClaims) {
    return lines.map((line) => ({
      selection: line.selection,
      quantity: line.claimedByUser,
    }));
  }

  let filledFirst = false;
  return lines.map((line) => {
    if (!filledFirst && line.maxForUser > 0) {
      filledFirst = true;
      return {
        selection: line.selection,
        quantity: Math.min(1, line.maxForUser),
      };
    }
    return { selection: line.selection, quantity: 0 };
  });
}

export function clampClaimQuantity(raw: number | string, maxForUser: number): number {
  const parsed = typeof raw === 'number' ? raw : Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.min(maxForUser, Math.max(0, parsed));
}
