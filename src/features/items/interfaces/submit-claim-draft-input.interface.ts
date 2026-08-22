import type { ClaimMutationsPlan } from './claim-mutations-plan.interface';
import type { ItemActions } from './item-actions.interface';

export interface SubmitClaimDraftInput {
  itemId: string;
  userId?: string | null;
  plan: ClaimMutationsPlan;
  itemActions: Pick<ItemActions, 'claimItems' | 'unclaimItem'>;
}
