import type { BuildClaimMutationsInput } from '../interfaces/build-claim-mutations-input.interface';
import type { ClaimItemParams } from '../interfaces/item-actions.interface';
import type { ClaimMutationsPlan } from '../interfaces/claim-mutations-plan.interface';
import type { ClaimQuantityDraft } from '../interfaces/claim-quantity-draft.interface';

function draftQuantityForSelection(
  draft: ClaimQuantityDraft[],
  selection: string | null
): number {
  const match = draft.find((entry) => entry.selection === selection);
  return match?.quantity ?? 0;
}

function toRequests(
  itemId: string,
  lines: BuildClaimMutationsInput['lines'],
  draft: ClaimQuantityDraft[],
  claimedByName: string | null,
  anonymous: boolean,
  includeLinked?: boolean
): ClaimItemParams[] {
  const requests: ClaimItemParams[] = [];
  for (const line of lines) {
    const quantity = Math.min(line.maxForUser, Math.max(0, draftQuantityForSelection(draft, line.selection)));
    if (quantity <= 0) {
      continue;
    }
    requests.push({
      itemId,
      claimedByName,
      anonymous,
      quantity,
      selection: line.selection,
    });
  }
  if (includeLinked && requests.length > 0) {
    requests[0] = { ...requests[0], includeLinked: true };
  }
  return requests;
}

export function buildClaimMutations(input: BuildClaimMutationsInput): ClaimMutationsPlan {
  const { itemId, lines, draft, claimedByName, anonymous, includeLinked } = input;
  const userHasClaims = lines.some((line) => line.claimedByUser > 0);
  const desiredMatchesCurrent = lines.every(
    (line) => draftQuantityForSelection(draft, line.selection) === line.claimedByUser
  );
  const allDesiredZero = lines.every(
    (line) => draftQuantityForSelection(draft, line.selection) <= 0
  );

  if (desiredMatchesCurrent) {
    return { type: 'noop' };
  }

  if (allDesiredZero) {
    return userHasClaims ? { type: 'unclaim-all' } : { type: 'noop' };
  }

  const requests = toRequests(itemId, lines, draft, claimedByName, anonymous, includeLinked);
  if (requests.length === 0) {
    return userHasClaims ? { type: 'unclaim-all' } : { type: 'noop' };
  }

  if (!userHasClaims) {
    return { type: 'create', requests };
  }

  return { type: 'replace', requests };
}
