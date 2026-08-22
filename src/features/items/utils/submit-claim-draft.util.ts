import type { SubmitClaimDraftInput } from '../interfaces/submit-claim-draft-input.interface';

export async function submitClaimDraft({
  itemId,
  userId,
  plan,
  itemActions,
}: SubmitClaimDraftInput): Promise<void> {
  switch (plan.type) {
    case 'noop':
      return;
    case 'unclaim-all':
      await itemActions.unclaimItem(itemId, userId);
      return;
    case 'create':
      await itemActions.claimItems(plan.requests);
      return;
    case 'replace':
      await itemActions.unclaimItem(itemId, userId);
      if (plan.requests.length > 0) {
        await itemActions.claimItems(plan.requests);
      }
      return;
    default: {
      const _exhaustive: never = plan;
      return _exhaustive;
    }
  }
}
