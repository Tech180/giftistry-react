import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionButtons } from './action-buttons.component';
import { ADD_SUBSTITUTION_ACTION_LABEL, EDIT_SUBSTITUTION_ACTION_LABEL } from '../../../constants/substitution-messages.constant';

const guestHandlers = {
  onClaim: () => {},
  onUnclaim: () => {},
  onDeleteRequest: () => {},
  onDeleteConfirm: () => {},
  onDeleteCancel: () => {},
};

describe('ActionButtons', () => {
  it('renders Edit and Delete for a list owner', () => {
    render(
      <ActionButtons
        isOwner
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

    expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Claim Item' })).not.toBeInTheDocument();
  });

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

  it('renders Unavailable when a sibling substitution claim locks the section', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser={false}
        isFullyClaimed
        isClaimUnavailable
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Claimed' })).not.toBeInTheDocument();
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

    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((button) => button.getAttribute('aria-label') ?? button.textContent);
    expect(labels.indexOf('Edit item')).toBeLessThan(labels.indexOf('Claim Item'));
    expect(labels.indexOf('Delete item')).toBeLessThan(labels.indexOf('Claim Item'));
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

    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((button) => button.getAttribute('aria-label') ?? button.textContent);
    expect(labels.indexOf('Edit item')).toBeLessThan(labels.indexOf('Unclaim'));
    expect(labels.indexOf('Delete item')).toBeLessThan(labels.indexOf('Unclaim'));
  });

  it('shows Add substitution before Unclaim when substitutionAction is set', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        substitutionAction={{
          mode: 'create',
          allowSubstitutions: true,
          onRequest: () => {},
        }}
        {...guestHandlers}
      />
    );

    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((button) => button.getAttribute('aria-label') ?? button.textContent);
    expect(labels.indexOf(ADD_SUBSTITUTION_ACTION_LABEL)).toBeLessThan(labels.indexOf('Unclaim'));
  });

  it('shows Add substitution before Claim Item when unclaimed', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser={false}
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        substitutionAction={{
          mode: 'create',
          allowSubstitutions: true,
          onRequest: () => {},
        }}
        {...guestHandlers}
      />
    );

    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((button) => button.getAttribute('aria-label') ?? button.textContent);
    expect(labels.indexOf(ADD_SUBSTITUTION_ACTION_LABEL)).toBeLessThan(labels.indexOf('Claim Item'));
  });

  it('hides Add substitution when substitutionAction is null', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        substitutionAction={null}
        {...guestHandlers}
      />
    );

    expect(
      screen.queryByRole('button', { name: ADD_SUBSTITUTION_ACTION_LABEL })
    ).not.toBeInTheDocument();
  });

  it('hides Add substitution when the active section is fully claimed', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser={false}
        isFullyClaimed
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        substitutionAction={null}
        {...guestHandlers}
      />
    );

    expect(
      screen.queryByRole('button', { name: ADD_SUBSTITUTION_ACTION_LABEL })
    ).not.toBeInTheDocument();
  });

  it('shows Edit substitution when substitutionAction is manage', () => {
    render(
      <ActionButtons
        isOwner={false}
        canCollaborate={false}
        claimedByCurrentUser
        isFullyClaimed={false}
        claimLoading={false}
        showDeleteConfirm={false}
        deleteLoading={false}
        substitutionAction={{
          mode: 'manage',
          allowSubstitutions: true,
          onRequest: () => {},
          onDelete: () => {},
        }}
        {...guestHandlers}
      />
    );

    expect(screen.getByRole('button', { name: EDIT_SUBSTITUTION_ACTION_LABEL })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: ADD_SUBSTITUTION_ACTION_LABEL })
    ).not.toBeInTheDocument();
  });
});
