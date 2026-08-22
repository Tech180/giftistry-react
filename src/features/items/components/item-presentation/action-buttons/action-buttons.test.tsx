import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionButtons } from './action-buttons.component';

const guestHandlers = {
  onClaim: () => {},
  onUnclaim: () => {},
  onDeleteRequest: () => {},
  onDeleteConfirm: () => {},
  onDeleteCancel: () => {},
};

describe('ActionButtons', () => {
  it('renders Claim Item for an available guest claim', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser={false}
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Claim Item' })).toBeInTheDocument();
  });

  it('renders Unclaim All and Update Claim when the user can adjust a claim', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        canAdjustClaim
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Unclaim All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Claim' })).toBeInTheDocument();
  });

  it('keeps Unclaim for a qty-1 claim', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Unclaim' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Unclaim All' })).not.toBeInTheDocument();
  });

  it('disables Unclaim All while the claim form is open', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        canAdjustClaim
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        unclaimDisabled
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Unclaim All' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Update Claim' })).toBeEnabled();
  });

  it('shows Claim Item with Edit and Delete for a suggestor', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate
        canEditItem
        claimedByCurrentUser={false}
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        onEdit={() => {}}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Claim Item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument();
  });

  it('shows Unclaim with Edit and Delete for a suggestor who claimed', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate
        canEditItem
        claimedByCurrentUser
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        onEdit={() => {}}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Unclaim' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument();
  });
});
