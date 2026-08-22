import type { ClaimQuantityDraft } from './claim-quantity-draft.interface';
import type { ClaimQuantityLine } from './claim-quantity-line.interface';

export interface BuildClaimMutationsInput {
  itemId: string;
  lines: ClaimQuantityLine[];
  draft: ClaimQuantityDraft[];
  claimedByName: string | null;
  anonymous: boolean;
  includeLinked?: boolean;
}
