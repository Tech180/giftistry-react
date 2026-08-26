import { describe, expect, it } from 'vitest';
import type { ActionButtonsVisibility } from '../interfaces/action-buttons-visibility.interface';
import { resolveActionButtonsLayoutMode } from './resolve-action-buttons-layout-mode.util';

const guest: ActionButtonsVisibility = {
  isOwner: false,
  canCollaborate: false,
  claimedByCurrentUser: false,
  isFullyClaimed: false,
};

describe('resolveActionButtonsLayoutMode', () => {
  it('keeps Unclaim for a qty-1 claim by the current user', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        claimedByCurrentUser: true,
      })
    ).toBe('unclaim');
  });

  it('uses Update claim when the current user can adjust a multi-count claim', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        claimedByCurrentUser: true,
        canAdjustClaim: true,
        isFullyClaimed: true,
      })
    ).toBe('update-claim');
  });

  it('disables Claimed when someone else fully claimed the item', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        isFullyClaimed: true,
        canAdjustClaim: true,
      })
    ).toBe('claimed');
  });

  it('disables Unavailable when a sibling substitution claim locks the section', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        isFullyClaimed: true,
        isClaimUnavailable: true,
        canAdjustClaim: true,
      })
    ).toBe('unavailable');
  });

  it('shows Claim for an available multi-count item', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        canAdjustClaim: true,
      })
    ).toBe('claim');
  });

  it('lets a suggestor claim instead of owner-edit', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        canEditItem: true,
      })
    ).toBe('claim');
  });

  it('lets a suggestor unclaim their qty-1 claim', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        canEditItem: true,
        claimedByCurrentUser: true,
      })
    ).toBe('unclaim');
  });

  it('lets a suggestor update a multi-count claim', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        canEditItem: true,
        claimedByCurrentUser: true,
        canAdjustClaim: true,
      })
    ).toBe('update-claim');
  });

  it('keeps owner-edit for list owners with canEditItem', () => {
    expect(
      resolveActionButtonsLayoutMode({
        isOwner: true,
        canCollaborate: true,
        canEditItem: true,
        claimedByCurrentUser: false,
        isFullyClaimed: false,
      })
    ).toBe('owner-edit');
  });

  it('hides all modes when archived', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        isArchived: true,
      })
    ).toBeNull();
  });

  it('hides all modes when expired', () => {
    expect(
      resolveActionButtonsLayoutMode({
        ...guest,
        isExpired: true,
      })
    ).toBeNull();
  });
});
