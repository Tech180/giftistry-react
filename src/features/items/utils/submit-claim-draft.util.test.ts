import { describe, expect, it, vi } from 'vitest';
import { submitClaimDraft } from './submit-claim-draft.util';

describe('submitClaimDraft', () => {
  it('does nothing for noop', async () => {
    const itemActions = {
      claimItems: vi.fn(),
      unclaimItem: vi.fn(),
    };
    await submitClaimDraft({
      itemId: 'item-1',
      userId: 'u1',
      plan: { type: 'noop' },
      itemActions,
    });
    expect(itemActions.claimItems).not.toHaveBeenCalled();
    expect(itemActions.unclaimItem).not.toHaveBeenCalled();
  });

  it('unclaims then claims on replace', async () => {
    const itemActions = {
      claimItems: vi.fn().mockResolvedValue([]),
      unclaimItem: vi.fn().mockResolvedValue(undefined),
    };
    const requests = [
      { itemId: 'item-1', quantity: 2, anonymous: false, claimedByName: 'Ada' },
    ];
    await submitClaimDraft({
      itemId: 'item-1',
      userId: 'u1',
      plan: { type: 'replace', requests },
      itemActions,
    });
    expect(itemActions.unclaimItem).toHaveBeenCalledWith('item-1', 'u1');
    expect(itemActions.claimItems).toHaveBeenCalledWith(requests);
    expect(itemActions.unclaimItem.mock.invocationCallOrder[0]).toBeLessThan(
      itemActions.claimItems.mock.invocationCallOrder[0]
    );
  });
});
